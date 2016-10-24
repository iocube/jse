var config, executeCode;
var response, load;

describe('indexSpec', function() {
    beforeEach(function() {
        load = function(moduleName) {
            delete require.cache[require.resolve(moduleName)];
            module = require(moduleName);

            return module;
        };

        response = {
            status: function() {
                return {
                    json: function(any) { return any; }
                }
            },
            json: function(any) {
                return any;
            }
        };
    });

    describe('executeCode', function() {
        it('should return error with name, message and stack properties if there is a problem with payload', function() {
            var executeCode = load('../../api/index/handlers').executeCode;

            var request = {
                body: {}
            };

            var result = executeCode(request, response);

            expect(result).toEqual({
                name: 'ValidationError',
                message: [
                    'instance requires property "code"',
                    'instance requires property "context"',
                    'instance requires property "language"'
                ],
                stack: null
            });
        });

        it('should return error if language is not enabled', function() {
            var request = {
                body: {
                    code: 'i += 1;',
                    context: {
                        i: 0
                    },
                    language: 'javascript'
                }
            };

            config = load('../../config');
            config.languages = [
                {name: 'coffeescript', enabled: true},
                {name: 'typescript', enabled: true}
            ];

            executeCode = load('../../api/index/handlers').executeCode;

            var result = executeCode(request, response);

            expect(result).toEqual({
                name: 'ValidationError',
                message: [
                    'instance.language is not one of enum values: coffeescript,typescript'
                ],
                stack: null
            });
        });

        it('should run code in context', function() {
            var request = {
                body: {
                    code: 'list.push(0)',
                    context: {
                        list: [1, 2, 3]
                    },
                    language: 'javascript'
                }
            };

            config = load('../../config');
            config.languages = [
                {name: 'javascript', enabled: true}
            ];

            executeCode = load('../../api/index/handlers').executeCode;
            var result = executeCode(request, response);

            console.log('reselt: ', result);
            expect(result.context.list).toEqual([1, 2, 3, 0]);
        });

        describe('coffeescript', function() {
            it('should call transpile function', function() {
                var request = {
                    body: {
                        code: '',
                        context: {},
                        language: 'coffeescript'
                    }
                };

                config = load('../../config');
                config.languages = [
                    {name: 'coffeescript', enabled: true}
                ];

                var coffeescript = load('coffee-script');
                spyOn(coffeescript, 'compile');

                executeCode = load('../../api/index/handlers').executeCode;
                executeCode(request, response);

                expect(coffeescript.compile).toHaveBeenCalled();
            });

            it('should call transpile function with correct parameters', function() {
                var request = {
                    body: {
                        code: '',
                        context: {},
                        language: 'coffeescript'
                    }
                };

                config = load('../../config');
                config.languages = [
                    {name: 'coffeescript', enabled: true}
                ];

                var coffeescript = load('coffee-script');
                spyOn(coffeescript, 'compile');

                executeCode = load('../../api/index/handlers').executeCode;
                executeCode(request, response);

                expect(coffeescript.compile).toHaveBeenCalledWith(request.body.code, {bare: true});
            });

            it('should return error if transpiling failed', function() {
                var request = {
                    body: {
                        // missing ']' at the end
                        code: 'square = (x) -> x * x\nlist = [square(n) for n in list',
                        context: {},
                        language: 'coffeescript'
                    }
                };

                config = load('../../config');
                config.languages = [
                    {name: 'coffeescript', enabled: true}
                ];

                executeCode = load('../../api/index/handlers').executeCode;
                var result = executeCode(request, response);

                expect(result).toEqual({
                    name: jasmine.any(String),
                    message: jasmine.any(String),
                    stack: jasmine.any(String)
                });
            });
        });

        describe('typescript', function() {
            it('should call typescript transpile function when language is set to typescript', function() {
                var request = {
                    body: {
                        code: '',
                        context: {},
                        language: 'typescript'
                    }
                };

                config = load('../../config');
                config.languages = [
                    {name: 'typescript', enabled: true}
                ];

                var typescript = load('typescript');
                spyOn(typescript, 'transpileModule');

                executeCode = load('../../api/index/handlers').executeCode;
                executeCode(request, response);

                expect(typescript.transpileModule).toHaveBeenCalled();
            });

            it('should call typescript transpile function with correct parameters', function() {
                var request = {
                    body: {
                        code: '',
                        context: {},
                        language: 'typescript'
                    }
                };

                config = load('../../config');
                config.languages = [
                    {name: 'typescript', enabled: true}
                ];

                var typescript = load('typescript');
                spyOn(typescript, 'transpileModule');

                executeCode = load('../../api/index/handlers').executeCode;
                executeCode(request, response);

                expect(typescript.transpileModule).toHaveBeenCalledWith(request.body.code, {compilerOptions: {noImplicitUseStrict: true}});
            });

            it('should return error if transpiling failed', function() {
                var request = {
                    body: { // missing 'f' at 'function'
                        code: 'unction square(x: number) { return x * x; } list = list.map(function (e) { return square(e); });',
                        context: {},
                        language: 'typescript'
                    }
                };

                config = load('../../config');
                config.languages = [
                    {name: 'typescript', enabled: true}
                ];

                executeCode = load('../../api/index/handlers').executeCode;
                var result = executeCode(request, response);

                expect(result).toEqual({
                    name: jasmine.any(String),
                    message: jasmine.any(String),
                    stack: jasmine.any(String)
                });
            });
        });
    });
});