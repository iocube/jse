const PORT = 8000;
const HOSTNAME = 'localhost';
const CODE_COMPILE_TIMEOUT_MS = 500;
const CODE_EXECUTION_TIMEOUT_MS = 500;

exports.PORT = PORT;
exports.HOSTNAME = HOSTNAME;
exports.CODE_EXECUTION_TIMEOUT_MS = CODE_EXECUTION_TIMEOUT_MS;
exports.CODE_COMPILE_TIMEOUT_MS = CODE_COMPILE_TIMEOUT_MS;
exports.MODULES_DIR = '../modules/node_modules';
exports.modules = {
    'faker': 'faker',
    'underscore': '_'
};

exports.languages = [
    {name: 'javascript', enabled: true},
    {name: 'coffeescript', enabled: true},
    {name: 'typescript', enabled: true}
];