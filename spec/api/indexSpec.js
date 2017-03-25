const request = require('request');
const jse = require('../../index');
const config = require('../../config');


const endpoint = `http://${config.HOSTNAME}:${config.PORT}/`;

describe('indexSpec', function() {
    describe('GET', function() {
        it('should fail', function(done) {
            request.get(endpoint, {json: true}, function(error, response, body) {
                expect(response.statusCode).toEqual(404);
                done();
            });
        });
    });

    describe('POST', function() {
        it('should return error if payload is empty', function(done) {
            request.post(endpoint, {json: true, body: {}}, function(error, response, body) {
                expect(response.statusCode).toEqual(400);
                done();
            });
        });

        it('should return error if code is missing', function(done) {
            var payload = {
                context: {},
                language: 'javascript'
            };

            request.post(endpoint, {json: true, body: payload}, function(error, response, body) {
                expect(response.statusCode).toEqual(400);
                done();
            });
        });

        it('should return error if language not specified', function(done) {
            var payload = {
                code: 'var number = 0;',
                context: {}
            };

            request.post(endpoint, {json: true, body: payload}, function(error, response, body) {
                expect(response.statusCode).toEqual(400);
                done();
            });
        });

        it('should return error if language is not supported', function(done) {
            var payload = {
                code: 'var number = 0;',
                context: {},
                language: 'Ada'
            };

            request.post(endpoint, {json: true, body: payload}, function(error, response, body) {
                expect(response.statusCode).toEqual(400);
                done();
            });
        });

        it('should return error if module is disabled or not supported', function(done) {
            var payload = {
                code: 'var number = 0;',
                context: {},
                language: 'javascript',
                modules: ['nosuchmodule']
            };

            request.post(endpoint, {json: true, body: payload}, function(error, response, body) {
                expect(response.statusCode).toEqual(400);
                done();
            });
        });

        describe('javascript', function() {
            it('should execute javascript code', function(done) {
                var payload = {
                    code: 'list.map(function(n) { return n * n; });',
                    context: {
                        list: [1, 2, 3]
                    },
                    language: 'javascript'
                };

                request.post(endpoint, {json: true, body: payload}, function(error, response, body) {
                    console.log(body);
                    expect(response.statusCode).toEqual(200);
                    done();
                });
            });

            it('should fail to execute javascript code with syntax error', function(done) {
                var payload = { // missing ')'
                    code: 'list.map(function(n) { return n * n; };',
                    context: {
                        list: [1, 2, 3]
                    },
                    language: 'javascript'
                };

                request.post(endpoint, {json: true, body: payload}, function(error, response) {
                    expect(response.statusCode).toEqual(400);
                    done();
                });
            });
        });

        describe('coffeescript', function() {
            it('should execute coffeescript code', function(done) {
                var payload = {
                    code: 'square = (x) -> x * x\nlist = [square(n) for n in list]',
                    context: {
                        list: [1, 2, 3]
                    },
                    language: 'coffeescript'
                };

                request.post(endpoint, {json: true, body: payload}, function(error, response, body) {
                    console.log(body);
                    expect(response.statusCode).toEqual(200);
                    done();
                });
            });

            it('should fail to execute javascript code with syntax error', function(done) {
                var payload = { // missing ']'
                    code: 'square = (x) -> x * x\nlist = [square(n) for n in list',
                    context: {
                        list: [1, 2, 3]
                    },
                    language: 'coffeescript'
                };

                request.post(endpoint, {json: true, body: payload}, function(error, response) {
                    expect(response.statusCode).toEqual(400);
                    done();
                });
            });
        });

        describe('typescript', function() {
            it('should execute typescript code', function(done) {
                var payload = {
                    code: 'function square(x: number) { return x * x; } list = list.map(function (e) { return square(e); });',
                    context: {
                        list: [1, 2, 3]
                    },
                    language: 'typescript'
                };

                request.post(endpoint, {json: true, body: payload}, function(error, response, body) {
                    console.log(body);
                    expect(response.statusCode).toEqual(200);
                    done();
                });
            });

            it('should fail to execute typescript code with syntax error', function(done) {
                var payload = { // function -> functio
                    code: 'functio square(x: number) { return x * x; } list = list.map(function (e) { return square(e); });',
                    context: {
                        list: [1, 2, 3]
                    },
                    language: 'typescript'
                };

                request.post(endpoint, {json: true, body: payload}, function(error, response) {
                    expect(response.statusCode).toEqual(400);
                    done();
                });
            });
        });
    });

    describe('PUT', function() {
        it('should fail', function(done) {
            request.put(endpoint, {json: true}, function(error, response) {
                expect(response.statusCode).toEqual(404);
                done();
            });
        });
    });

    describe('PATCH', function() {
        it('should fail', function(done) {
            request.patch(endpoint, {json: true}, function(error, response) {
                expect(response.statusCode).toEqual(404);
                done();
            });
        });
    });

    describe('DELETE', function() {
        it('should fail', function(done) {
            request.delete(endpoint, {json: true}, function(error, response) {
                expect(response.statusCode).toEqual(404);
                done();
            });
        });
    });
});

