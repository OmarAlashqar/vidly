/* Sets up logging and error handling */
require('express-async-errors'); // monkey patches error handling for routers
const winston = require('winston'); // logging errors via transports

module.exports = function() {
    // setup logging to a file
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    
    // winston logs unhandled exceptions and logs them into a file
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );
    
    process.on('unhandledRejection', (ex) => { throw ex }); // throw it to winston's catch
}