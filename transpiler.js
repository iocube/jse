const coffeescript = require('coffee-script');
const typescript = require('typescript');


class Transpiler {
    constructor(code) {
        this.code = code;
    }

    transpile() {
        throw new Error('transpile() not implemented');
    }
}

class JavaScript extends Transpiler {
    constructor(code) {
        super(code);
    }

    transpile() {
        return this.code;
    }
}

class CoffeeScript extends Transpiler {
    constructor(code) {
        super(code);
    }

    transpile(options) {
        return coffeescript.compile(this.code, options);
    }
}

class TypeScript extends Transpiler {
    constructor(code) {
        super(code);
    }

    transpile(options) {
        return typescript.transpileModule(this.code, options).outputText;
    }
}

exports.JavaScript = JavaScript;
exports.CoffeeScript = CoffeeScript;
exports.TypeScript = TypeScript;