const express = require('express');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();

// Routes
const genres = require('./routes/genres');
const index = require('./routes/index');

// Debugger for console output
// Usage: Set an environment variable: DEBUG=vidly:startup,vidly:db or DEBUG=*
// Usage: Set an argument: DEBUG=vidly:db nodemon index.js
const debug = require('debug')('vidly:startup');

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
app.use(helmet()); // sets HTTP headers for security
app.use(express.static('public')); // serves static files from public/

// Routes
app.use('/api/genres', genres);
app.use('/', index);

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); // logs HTTP requests to the console
    debug('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));