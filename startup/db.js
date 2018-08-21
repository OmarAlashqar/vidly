/* Connect to DB */
const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

// Make sure DB url is set: 'mongodb://localhost:<port>/<db>' etc.
module.exports = function(app) {
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => winston.info(`Connected to ${db}...`));
}