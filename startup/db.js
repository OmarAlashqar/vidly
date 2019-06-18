/* Connect to DB */
const mongoose = require('mongoose');
const winston = require('winston');

// Make sure DB url is set: 'mongodb://localhost:<port>/<db>' etc.
module.exports = function(app) {
    let mongoURI;

    if (process.env.NODE_ENV === 'test') mongoURI = process.env.MONGO_TEST_URI;
    else mongoURI = process.env.MONGO_URI;

    mongoose.connect(mongoURI, { useNewUrlParser: true })
        .then(() => winston.info(`Connected to ${mongoURI}...`));
}