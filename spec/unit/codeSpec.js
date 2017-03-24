describe('codeSpec', function() {
    "use strict";

    const Code = require('../../code/code').Code;
    const config = require('../../config');
    const NodeModule = require('../../code/nodeModule').NodeModule;

    beforeEach(function() {});

    it('should import the code module', function() {
        expect(Code).toBeDefined();
    });

    it('should run javascript code', function() {
        const code = 'lst = lst.map(x => x + 1)';
        const result = new Code(code, 'javascript', {lst: [1, 2, 3]}).run();

        expect(result.lst).toEqual([2, 3, 4]);
    });

    it('should run typescript code', function() {
        const code = `
            function inc(x: number) { return x + 1; }

            lst = lst.map(function (e) {
                return inc(e);
            });
        `;

        const result = new Code(code, 'typescript', {lst: [1, 2, 3]}).run(
            config.TYPESCRIPT_TRANSPILER_OPTIONS,
            config.VM_SCRIPT_OPTIONS,
            config.VM_RUN_IN_CONTEXT_OPTIONS
        );
        expect(result.lst).toEqual([2, 3, 4]);
    });

    it('should run coffeescript code', function() {
        const code = `
            inc = (x) -> x + 1
            lst = (inc(x) for x in lst)
        `;

        const result = new Code(code, 'coffeescript', {lst: [1, 2, 3]}).run(
            config.COFFEESCRIPT_TRANSPILER_OPTIONS,
            config.VM_SCRIPT_OPTIONS,
            config.VM_RUN_IN_CONTEXT_OPTIONS
        );
        expect(result.lst).toEqual([2, 3, 4]);
    });

    it('should load module in to context', function() {
        const nodeModule = new NodeModule('../modules/node_modules/mymodule', 'mymodule');
        const code = new Code('answer = mymodule(1, 1);', 'javascript', {answer: 0}, [nodeModule]);
        const myModule = {
            add: function(x, y) {
                return x + y;
            }
        };

        spyOn(nodeModule, 'doRequire').and.returnValue(myModule.add);
        const result = code.run();
        expect(result.answer).toEqual(2);
    });

    it('should unload module from context', function() {
        const nodeModule = new NodeModule('../modules/node_modules/mymodule', 'mymodule');
        const code = new Code('mymodule();', 'javascript', {}, [nodeModule]);
        const myModule = {
            add: function() {}
        };

        spyOn(nodeModule, 'doRequire').and.returnValue(myModule.add);
        const result = code.run();
        expect(result.hasOwnProperty('mymodule')).toEqual(false);
    });
});
