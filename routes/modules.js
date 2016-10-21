const express = require('express');
const router = express.Router();

const config = require('../config');
const installedModules = require('../modules/package.json');


router.get('/modules', function(request, response) {
    const whitelisted = config.modules;
    response.json({installed: installedModules.dependencies, whitelisted: whitelisted});
});

module.exports = router;