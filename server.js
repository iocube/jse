const http = require('http');
const vm = require('vm');
const util = require('util');
const config = require('./config');
const validate = require('jsonschema').validate;
const url = require('url');
const coffeescript = require('coffee-script');

const schema = {
    type: 'object',
    required: ['code', 'context', 'language'],
    properties: {
        code: {
            type: 'string'
        },
        context: {
            type: 'object'
        },
        modules: {
            type: 'array'
        },
        language: {
            enum: [
                config.languages.JAVASCRIPT,
                config.languages.COFFEESCRIPT
            ]
        }
    }
};
const server = http.createServer();
const HTTP_STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405
};

const routes = {
    '/': {POST: execute_js_code},
    '/modules': {GET: listModules}
};

function http_base_response(response, json, statusCode) {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');

    if (json) {
        response.end(JSON.stringify(json));
    } else {
        response.end();
    }
}

function http_bad_request(response, json) {
    http_base_response(response, json, HTTP_STATUS_CODE.BAD_REQUEST);
}

function http_ok(response, json) {
    http_base_response(response, json, HTTP_STATUS_CODE.OK);
}

function http_not_found(response, json) {
    http_base_response(response, json, HTTP_STATUS_CODE.NOT_FOUND);
}

function http_method_not_allowed(response, json) {
    http_base_response(response, json, HTTP_STATUS_CODE.METHOD_NOT_ALLOWED);
}

function execute_js_code(request, response) {
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
            let code = '';
            switch (jsCode.language) {
                case config.languages.JAVASCRIPT:
                    code = jsCode.code;
                    console.log('language: javascript');
                    break;
                case config.languages.COFFEESCRIPT:
                    // --bare, without it code will be placed inside wrapper
                    // it makes access to context difficult
                    code = coffeescript.compile(jsCode.code, {bare: true});
                    console.log('language: coffeescript');
                    break;
            }

            let compiled = new vm.Script(code, {filename: 'your-code.js', timeout: config.CODE_COMPILE_TIMEOUT_MS});
            let context = new vm.createContext(jsCode.context);

            // import dependencies
            jsCode.modules.forEach(function(moduleName) {
                if (config.modules.hasOwnProperty(moduleName)) {
                    let variableName = config.modules[moduleName];
                    context[variableName] = require(`${config.MODULES_DIR}/${moduleName}`);
                }
            });

            compiled.runInContext(context, {filename: 'your-code.js', timeout: config.CODE_EXECUTION_TIMEOUT_MS});

            // clear context from imported modules
            jsCode.modules.forEach(function(moduleName) {
                delete context[moduleName];
            });

            console.log('code: \n\t', code);
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

function isRouteExists(routes, path) {
    return routes[path] || routes[path + '/'];
}

function isMethodAllowed(routes, path, method) {
    return routes[path][method];
}

function listModules(request, response) {
    const installed = require('./modules/package.json');
    const whitelisted = config.modules;

    http_ok(response, {installed: installed.dependencies, whitelisted: whitelisted});
}

server.on('request', (request, response) => {
    console.log('--------------------------------------------------');
    console.log(`${new Date()}: ${request.method} ${request.url}`);

    let requestedPath = url.parse(request.url).pathname;

    if (!isRouteExists(routes, requestedPath)) {
        http_not_found(response);
        return;
    }

    if (!isMethodAllowed(routes, requestedPath, request.method)) {
        http_method_not_allowed(response);
        return;
    }

    routes[requestedPath][request.method](request, response);
});

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

console.log(`JSE listening on ${config.HOSTNAME}:${config.PORT}`);
server.listen(config.PORT, config.HOSTNAME);
