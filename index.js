const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')(); // logging + error handling
require('./startup/routes')(app); // middleware + routes setup
require('./startup/db')(app); // connect to db
require('./startup/config')(app); // config settings
require('./startup/validation')(app); // setup validation

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Server listening on port ${port}...`));