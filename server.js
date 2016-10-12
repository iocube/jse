const http = require('http');
const vm = require('vm');
const util = require('util');
const config = require('./config');

const server = http.createServer();

function handle_post_request(request, response) {
  let jsCode = '';

  request.on('data', (data) => {
    jsCode += data;
  });

  request.on('end', () => {
    jsCode = JSON.parse(jsCode);
    let compiled = new vm.Script(jsCode.code);
    let context = new vm.createContext(jsCode.context);

    console.log('code: \n\t', jsCode.code);
    console.log('context: \n\t', jsCode.context);

    compiled.runInContext(context);

    console.log('result: \n\t', jsCode.context);
    console.log('--------------------------------------------------');

    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(jsCode.context));
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
