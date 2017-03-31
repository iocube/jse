const path = require('path');
const bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'jse',
    streams: [
        {
            level: 'info',
            path: path.join(__dirname, 'jse.run.log')
        }
    ]
});

exports.logger = log;