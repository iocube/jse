class NodeModule {
    constructor(path, alias) {
        this.alias = alias;
        this.path = path;
    }

    doRequire() {
        return require(this.path);
    }
}


exports.nodeModule = NodeModule;