/* Setup for middleware + routes */
const express = require('express');
const morgan = require('morgan'); // logs HTTP requests to the console
const helmet = require('helmet'); // sets HTTP headers for security
const error = require('../middleware/error'); // error handling middleware

// Routes
const index = require('../routes/index');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');

// Debugger for console output
// Usage: Set an environment variable: DEBUG=vidly:startup,vidly:db or DEBUG=*
// Usage: Set an argument: DEBUG=vidly:db nodemon index.js
const debug = require('debug')('vidly:startup');

module.exports = function(app) {
    /* Middleware */
    app.use(express.json()); // parses JSON in req.body
    app.use(express.urlencoded({ extended: true })); // parses urlencoded in req.body
    app.use(helmet());
    app.use(express.static('public')); // serves static files from public/
    
    if (app.get('env') === 'development') {
        app.use(morgan('tiny'));
        debug('Morgan enabled...');
    }

    // Routes
    app.use('/', index);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use(error); // error handling middleware
}