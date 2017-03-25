const jse = require('../../index');


var server;

beforeEach(function(done) {
    server = jse.run(done);
});

afterEach(function(done) {
    server.close(done);
});