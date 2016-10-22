const request = require('request');
const jse = require('../jse');
const config = require('../config');
const expect = require('expect.js');

var server;
const endpoint = `http://${config.HOSTNAME}:${config.PORT}/modules`;



describe('moduleSpec', function() {
    beforeEach(function(done) {
        console.log('moduleSpec - start');
        server = jse.run();
        done();
    });

    afterEach(function(done) {
        server.close(function() {
            console.log('moduleSpec - close');
            done();
        });
    });

    describe('GET', function() {
       it('should return 200 status code', function(done) {
            request.get(endpoint, function(error, response) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('should return json', function(done) {
            request.get(endpoint, {json: true}, function(error, response, body) {
                expect(typeof body).to.equal('object');
                done();
            });
        });

        it('should return expected properties', function(done) {
            request.get(endpoint, {json: true}, function(error, response, body) {
                expect(typeof body.installed).to.equal('object');
                expect(typeof body.whitelisted).to.equal('object');
                done();
            });
        });
    });

    describe('POST', function() {
        it('should fail', function(done) {
            request.post(endpoint, {json: true}, function(error, response) {
                expect(response.statusCode).to.equal(404);
                done();
            });
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

