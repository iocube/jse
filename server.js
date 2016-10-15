const http = require('http');
const vm = require('vm');
const util = require('util');
const config = require('./config');
const validate = require('jsonschema').validate;
const schema = {
    type: 'object',
    required: ['code', 'context'],
    properties: {
        code: {
            type: 'string'
        },
        context: {
            type: 'object'
        }
    }
};

const server = http.createServer();
const HTTP_STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400
};

function http_bad_request(response, json) {
    response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    response.setHeader('Content-Type', 'application/json');
    console.log(json);
    response.end(JSON.stringify(json));
}

function http_ok(response, json) {
    response.statusCode = HTTP_STATUS_CODE.OK;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(json));
}

function handle_post_request(request, response) {
    let jsCode = '';

    request.on('data', (data) => {
        jsCode += data;
    });

    request.on('end', () => {
        try {
            jsCode = JSON.parse(jsCode);
        } catch (error) {
            http_bad_request(response, {name: error.name, message: error.message, stack: null});
            return;
        }

        let validatorResult = validate(jsCode, schema);
        if (validatorResult.errors.length > 0) {
            let message = validatorResult.errors.map((error) => {
                return error.stack;
            });

            http_bad_request(response, {name: 'ValidationError', message: message, stack: null});
            return;
        }
        if (typeof jsCode.context !== 'object') {
            http_bad_request(response, {name: 'ValidationError', message: 'context must be an object', stack: null});
            return;
        }

        try {
            let compiled = new vm.Script(jsCode.code, {filename: 'your-code.js', timeout: config.CODE_COMPILE_TIMEOUT_MS});
            let context = new vm.createContext(jsCode.context);
            compiled.runInContext(context, {filename: 'your-code.js', timeout: config.CODE_EXECUTION_TIMEOUT_MS});

            console.log('code: \n\t', jsCode.code);
            console.log('context: \n\t', jsCode.context);
        } catch (error) {
            http_bad_request(response, {name: error.name, message: error.message, stack: error.stack});
            return;
        }

        console.log('result: \n\t', jsCode.context);
        console.log('--------------------------------------------------');

        http_ok(response, {context: jsCode.context});
    });
}

server.on('request', (request, response) => {
    console.log('--------------------------------------------------');
    console.log(`${new Date()}: ${request.method} ${request.url}`);

    switch (request.method) {
        case 'POST':
            handle_post_request(request, response);
            break;
        default:
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({}));
            break;
    }
});

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

console.log(`JSE listening on ${config.HOSTNAME}:${config.PORT}`);
server.listen(config.PORT, config.HOSTNAME);
