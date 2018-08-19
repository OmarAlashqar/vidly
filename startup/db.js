/* Connect to DB */
const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

// Make sure DB url is set: 'mongodb://localhost:<port>/<db>' etc.
module.exports = function(app) {
    const db = app.get('env') === 'development' ? 'DEV_DB' : 'PROD_DB';
    mongoose.connect(config.get(db), { useNewUrlParser: true })
        .then(() => winston.info('Connected to DB...'));
}