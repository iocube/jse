### Description
In this directory you should install modules that can be used by users when
running code in [vm](https://nodejs.org/api/vm.html), these modules will
be added to the context.

### Adding a new module
```
$ cd jse/modules
$ npm install underscore --save
```

Edit `config.js` in root directoryso that JSE knows to require this module:
```
exports.modules = {
    'underscore': '_'
};
```
Where:
- **underscore** - module name to be `require()`'d
- **_** - the module will be available under this name when code run in vm, for example,
 in our case underscore will be available as '_'

### Why
The reason why seperate `package.json` needed it's because to avoid polluting
the project's `package.json` with modules that actually not needed to run this project.