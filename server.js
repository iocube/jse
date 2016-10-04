/*
  Server executes JavaScript code and returns a result.
  POST /

POST Request:
{
	"code": "list.push(0);",
	"context": {
		"list": [1, 2, 3]
	}
}

Response:
{
  "list": [1, 2, 3, 0]
}
*/

const http = require('http');
const vm = require('vm');
const util = require('util');
var PORT = 8000;

const server = http.createServer();

server.on('request', (request, response) => {
  console.log(request.method, request.url);

  if (request.method == 'POST') {
    var jsCode = '';

    request.on('data', function (data) {
      jsCode += data;
    });

    request.on('end', function () {
      jsCode = JSON.parse(jsCode);
      var compiled = new vm.Script(jsCode.code);
      var context = new vm.createContext(jsCode.context);

      console.log(jsCode.context);

      compiled.runInContext(context);

      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(jsCode.context));
    });
  } else {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({}));
  }
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

console.log('listening on', PORT);
server.listen(PORT);
