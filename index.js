require('dotenv').config();
const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/config')(app); // config settings
require('./startup/logging')(); // logging + error handling
require('./startup/routes')(app); // middleware + routes setup
require('./startup/db')(app); // connect to db
require('./startup/validation')(app); // setup validation
if (process.env.NODE_ENV === 'production') {
    require('./startup/prod')(app);
}

const port = process.env.PORT;
const server = app.listen(port, () => winston.info(`Server listening on port ${port}...`));

module.exports = server;