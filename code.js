const vm = require('vm');
const transpiler = require('./transpiler');


const languageMap = new Map([
    ['javascript', transpiler.JavaScript],
    ['coffeescript', transpiler.CoffeeScript],
    ['typescript', transpiler.TypeScript]
]);

class Code {
    constructor(code, language = 'javascript', context = {}, nodeModules = []) {
        this.code = code;
        this.language = language;
        this.transpiler = languageMap.get(language);
        this.context = JSON.parse(JSON.stringify(context));
        this.nodeModules = nodeModules;
    }

    run(transpilerOptions, compilerOptions, runOptions) {
        const transpiled = new this.transpiler(this.code).transpile(transpilerOptions);
        const compiled = new vm.Script(transpiled, compilerOptions);

        this._loadNodeModulesToContext();
        compiled.runInNewContext(this.context, runOptions);
        this._unloadNodeModulesFromContext();

        return this.context;
    }

    _loadNodeModulesToContext() {
        this.nodeModules.forEach(function(nodeModule) {
            this.context[nodeModule.alias] = nodeModule.doRequire();
        });
    }

    _unloadNodeModulesFromContext() {
        this.nodeModules.forEach(function(nodeModule) {
            delete this.context[nodeModule.alias];
        });
    }
}

exports.languageMap = languageMap;
exports.Code = Code;