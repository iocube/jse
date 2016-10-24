const express = require('express');

const handlers = require('./handlers');


const router = express.Router();

router.get('/modules', handlers.listInstalledModules);

exports.router = router;