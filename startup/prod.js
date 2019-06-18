const helmet = require('helmet'); // sets HTTP headers for security
const compression = require('compression');

module.exports = function(app) {
    app.use(helmet());
    app.use(compression());
}