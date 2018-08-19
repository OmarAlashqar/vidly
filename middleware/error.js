const winston = require('winston');

/* Middleware should be used after all routes are defined */

module.exports = function (err, req, res, next) {
    winston.error(err.message, err);
    res.send(500).send('something went wrong.');
}