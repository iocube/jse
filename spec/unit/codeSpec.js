describe('codeSpec', function() {
    "use strict";

    const Code = require('../../code').Code;
    const config = require('../../config');

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
        // TODO
    });

    it('should unload module from context', function() {
        // TODO
    });
});
