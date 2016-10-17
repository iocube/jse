Here you should install modules that can be used by users when running code in [vm](https://nodejs.org/api/vm.html).

Example:
`$ npm install underscore --save`

Edit `config.js` in root directory to make JSE know to require this module:
```
exports.dependencies = {
    'underscore': '_'}
};
```
**key** - module name to be `require()`'d.
**value** - the module will be available under this name when code run in vm.

The reason why seperate `package.json` needed it's because to avoid polluting the project's `package.json` with modules that actually not needed to run this project.