const request = require('request');
const jse = require('../jse');
const config = require('../config');
const expect = require('expect.js');

var server;
const endpoint = `http://${config.HOSTNAME}:${config.PORT}/`;

describe('indexSpec', function() {
    beforeEach(function(done) {
        server = jse.run();
        console.log('indexSpec - start');
        done();
    });

    afterEach(function(done) {
        server.close(done);
        console.log('indexSpec - close');
    });

    describe('GET', function() {
        it('should fail', function(done) {
            request.post(endpoint, {json: true}, function(error, response) {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });

    describe('POST', function() {
        it('should', function(done) {
            done();
        });
    });

    describe('PUT', function() {
        it('should fail', function(done) {
            request.post(endpoint, {json: true}, function(error, response) {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });

    describe('PATCH', function() {
        it('should fail', function(done) {
            request.post(endpoint, {json: true}, function(error, response) {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });

    describe('DELETE', function() {
        it('should fail', function(done) {
            request.post(endpoint, {json: true}, function(error, response) {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });
});

