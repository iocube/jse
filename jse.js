const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config');
const middleware = require('./middleware');

// routes
const modules = require('./routes/modules');
const index = require('./routes/index');


const app = express();

app.use(bodyParser.json());
app.use(middleware.cors);
app.use(index);
app.use(modules);
app.use(middleware.errorHandler);

app.listen(config.PORT, config.HOSTNAME, function () {
    console.log(`JSE listening on ${config.HOSTNAME}:${config.PORT}`);
});
