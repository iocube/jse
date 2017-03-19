const PORT = 8000;
const HOSTNAME = 'localhost';
const CODE_COMPILE_TIMEOUT_MS = 500;
const CODE_EXECUTION_TIMEOUT_MS = 500;

exports.PORT = PORT;
exports.HOSTNAME = HOSTNAME;
exports.CODE_EXECUTION_TIMEOUT_MS = CODE_EXECUTION_TIMEOUT_MS;
exports.CODE_COMPILE_TIMEOUT_MS = CODE_COMPILE_TIMEOUT_MS;
exports.VM_SCRIPT_OPTIONS = {
    filename: 'your-code.js',
    timeout: CODE_COMPILE_TIMEOUT_MS
};

exports.VM_RUN_IN_CONTEXT_OPTIONS = {
    filename: 'your-code.js',
    timeout: CODE_EXECUTION_TIMEOUT_MS
};

exports.TYPESCRIPT_TRANSPILER_OPTIONS = {
    compilerOptions: {
        oImplicitUseStrict: true,
        module: 'ES6'
    }
};

exports.COFFEESCRIPT_TRANSPILER_OPTIONS = {
    bare: true
};

exports.MODULES_DIR = '../modules/node_modules';
exports.moduleToAlias = {
    'faker': 'faker',
    'underscore': '_'
};

exports.languages = [
    {name: 'javascript', enabled: true},
    {name: 'coffeescript', enabled: true},
    {name: 'typescript', enabled: true}
];

