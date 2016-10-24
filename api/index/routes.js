const express = require('express');

const handlers = require('./handlers');


const router = express.Router();

router.post('/', handlers.executeCode);

exports.router = router;