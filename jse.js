const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');

// routes
const modules = require('./routes/modules');
const index = require('./routes/index');


const app = express();

app.use(bodyParser.json());
app.use(index);
app.use(modules);
app.use(function (error, request, response, next) {
    response.status(error.statusCode).json({
        name: error.name,
        message: error.message,
        stack: null
    });
});

app.listen(config.PORT, config.HOSTNAME, function () {
    console.log(`JSE listening on ${config.HOSTNAME}:${config.PORT}`);
});
