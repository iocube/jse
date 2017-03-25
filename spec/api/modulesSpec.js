const request = require('request');
const jse = require('../../index');
const config = require('../../config');


const endpoint = `http://${config.HOSTNAME}:${config.PORT}/modules`;

describe('modulesSpec', function() {
    describe('GET', function() {
       it('should return 200 status code', function(done) {
            request.get(endpoint, function(error, response) {
                expect(response.statusCode).toEqual(200);
                done();
            });
        });

        it('should return json', function(done) {
            request.get(endpoint, {json: true}, function(error, response, body) {
                expect(typeof body).toEqual('object');
                done();
            });
        });

        it('should return expected properties', function(done) {
            request.get(endpoint, {json: true}, function(error, response, body) {
                expect(typeof body.installed).toEqual('object');
                expect(typeof body.whitelisted).toEqual('object');
                done();
            });
        });
    });

    describe('POST', function() {
        it('should fail', function(done) {
            request.post(endpoint, {json: true}, function(error, response) {
                expect(response.statusCode).toEqual(404);
                done();
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

