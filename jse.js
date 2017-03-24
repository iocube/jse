function run(callback) {
    const express = require('express');
    const bodyParser = require('body-parser');

    const config = require('./config');
    const middleware = require('./middleware');

    // routes
    const index = require('./api/index/routes').router;
    const modules = require('./api/modules').router;


    const app = express();

    app.use(bodyParser.json());
    app.use(middleware.cors);
    app.use(index);
    app.use(modules);
    app.use(middleware.errorHandler);

    return app.listen(config.PORT, config.HOSTNAME, function () {
        console.log(`JSE listening on ${config.HOSTNAME}:${config.PORT}`);
        if (callback) {
            callback();
        }
    });
}

if (require.main === module) {
    run();
}

exports.run = run;