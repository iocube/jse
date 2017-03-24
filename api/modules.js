const express = require('express');

const modules = require('../config').MODULES;


const router = express.Router();
router.get('/modules', list);

function list(request, response) {
    const modulesList = [...modules.values()].map((module) => {
        return {
            name: module.name,
            alias: module.alias || '',
            version: module.version
        };
    });

    response.json(modulesList);
}

exports.router = router;
