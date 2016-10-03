'use strict';

var through = require('through');
var winston = require('winston');
require('winston-papertrail').Papertrail;

var logger = new winston.Logger({
    transports: [
        new (winston.transports.Papertrail)({
            silent: process.env.NODE_ENV === 'test',
            host: 'logs4.papertrailapp.com',
            port: 24711
        })
    ]
});

logger.asStream = function asStream(level) {
    return through(function (data) {
        logger.log(level, String(data));
    });
};


module.exports = logger;
