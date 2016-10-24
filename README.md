# JavaScript Executer (JSE)
JSE is a small web service built with [ExpressJS](http://expressjs.com/) intended to run JavaScript, CoffeeScript and TypeScript 
code using [vm](https://nodejs.org/api/vm.html) (NodeJS) module.

## Limitations & Considerations
- security. I didn't spent time on making it secure, it's not intended to run on production, it's a toy.
- `context` is limited in types it can contain, currently its limited to same types as JSON, that means, 
functions will be omitted from request and response objects.

## Setup
Installing project dependencies:
`$ npm install`

Installing modules that will be available for use when code is running:
```
$ cd modules
$ npm install
```
to see how to install and include new modules, see [modules/README.md](/modules/README.md).

## Running
`$ node jse.js` or `$ npm start`

## Unit Tests
`$ npm run test-unit`

## API Tests
`$ npm run test-api`

## Routes
Endpoint | Description |
---- | --------------- |
/ | Execute JavaScript code |
/modules | Get information about installed and whitelisted node modules |

### `POST /`
Execute JavaScript code with given context and modules.

#### Fields
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>code</code></td>
            <td>required</td>
            <td>string</td>
            <td>code to be executed</td>
        </tr>
        <tr>
            <td><code>context</code></td>
            <td>required</td>
            <td>object</td>
            <td>context</td>
        </tr>
        <tr>
            <td><code>language</code></td>
            <td>required</td>
            <td>string</td>
            <td>type of language: javascript, typescript, coffeescript</td>
        </tr>
        <tr>
            <td><code>modules</code></td>
            <td>optional</td>
            <td>list of strings</td>
            <td>modules that code can have access to when executed</td>
        </tr>
    </tbody>
</table>

#### Example Request
```json
{
	"code": "list = _.map(list, function(e) { return e + 1; })",
	"context": {
	    "list": [1, 2, 3]
	},
	"language": "javascript",
	"modules": [
	    "underscore"
	]
}
```

#### Example Response
```json
{
  "context": {
    "list": [
      2,
      3,
      4
    ]
  }
}
```

#### Example: [CoffeeScript] Squaring all numbers in list
**code**
```coffeescript
square = (x) -> x * x
list = [square(n) for n in list]
```

**curl**
```bash
curl -H "Content-Type: application/json" -X POST -d '{"code": "square = (x) -> x * x\nlist = [square(n) for n in list]", "context": {"list": [1, 2, 3]}, "language": "coffeescript"}' http://localhost:8000/
```

**response**
```json
{"context":{"list":[[1,4,9]],"n":3}}
```

#### Example: [TypeScript] Creating class instance
**code**
```
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

greeter = new Greeter("world");
```

**curl**
```
curl -H "Content-Type: application/json" -X POST -d '{"code": "class Greeter { greeting: string; constructor(message: string) { this.greeting = message; } greet() { return \"Hello, \" + this.greeting; } } greeter = new Greeter(\"world\");", "context": {"greeter": {}}, "language": "typescript"}' http://localhost:8000/

```

**response**
```
{"context":{"greeter":{"greeting":"world"}}}
```

> NOTE: `greet()` method was omitted from response. 

### `GET /modules`
Get information about installed and whitelisted node modules

#### Example Request
```bash
curl -H "Content-Type: application/json" -X GET http://localhost:8000/modules
```

#### Example Response
```json
{
  "installed": {
    "faker": "^3.1.0",
    "underscore": "^1.8.3"
  },
  "whitelisted": {
    "faker": "faker",
    "underscore": "_"
  }
}
```
