require('express-async-errors'); // monkey patches error handling for routers
const express = require('express');
const config = require('config'); // sets up environment variables
const winston = require('winston'); // logging errors via transports
const morgan = require('morgan'); // logs HTTP requests to the console
const helmet = require('helmet'); // sets HTTP headers for security
const mongoose = require('mongoose');
const Joi = require('joi'); // schema http requests validation
Joi.objectId = require('joi-objectid')(Joi);

const error = require('./middleware/error'); // error handling middleware

const app = express();

// setup logging to a file
winston.add(new winston.transports.File({ filename: 'logfile.log' }));

// Debugger for console output
// Usage: Set an environment variable: DEBUG=vidly:startup,vidly:db or DEBUG=*
// Usage: Set an argument: DEBUG=vidly:db nodemon index.js
const debug = require('debug')('vidly:startup');

process.on('uncaughtException', (ex) => {
    debug('Uncaught exception');
    winston.error(ex.message, ex);
});

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: vidly_jwtPrivateKey is not defined');
    process.exit(1);
}

// Routes
const index = require('./routes/index');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

/* Connect to DB */
// Make sure DB url is set: 'mongodb://localhost:<port>/<db>' etc.
const db = app.get('env') === 'development' ? 'DEV_DB' : 'PROD_DB';
mongoose.connect(config.get(db), { useNewUrlParser: true })
    .then(() => console.log('Connected to DB...'))
    .catch((err) => console.error('Unable to connect to DB...')); 

/* Config */
app.set('view engine', 'pug'); // use pug for templating
app.set('views', './views'); // default

console.log(`Application name: ${config.get('name')}`);

/* Middleware */
app.use(express.json()); // parses JSON in req.body
app.use(express.urlencoded({ extended: true })); // parses urlencoded in req.body
app.use(helmet());
app.use(express.static('public')); // serves static files from public/

// Routes
app.use('/', index);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));