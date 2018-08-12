const express = require('express');
const config = require('config');
const Joi = require('joi');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();

// Debugger for console output
// Usage: Set an environment variable: DEBUG=vidly:startup,vidly:db or DEBUG=*
// Usage: Set an argument: DEBUG=vidly:db nodemon index.js
const debug = require('debug')('vidly:startup');

app.set('view engine', 'pug'); // use pug for templating
app.set('views', './views'); // default

/* Config */
console.log(`Application name: ${config.get('name')}`);
console.log(`Mail server: ${config.get('mail.host')}`);
console.log(`Mail password: ${config.get('mail.password')}`);

/* Middleware */
app.use(express.json()); // parses JSON in req.body
app.use(express.urlencoded({ extended: true })); // parses urlencoded in req.body
app.use(helmet()); // sets HTTP headers for security
app.use(express.static('public')); // serves static files from public/

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); // logs HTTP requests to the console
    debug('Morgan enabled...');
}

// Fake database model for now
const genres = [
    { id: 1, name: 'action' },
    { id: 2, name: 'adventure' },
    { id: 3, name: 'comedy' },
    { id: 4, name: 'sci-fi' }
];

app.get('/', (req, res) => {
    res.render('index', { title: 'Vidly', message: 'Vidly loves cats!' });
});

/* API endpoints */

// Access a list of all genres
app.get('/api/genres', (req, res) => {
    res.send(JSON.stringify(genres));
});

// Access a specific genre by ID
app.get('/api/genres/:id', (req, res) => {
    // Check if genre exists
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Genre with given id was not found');

    res.send(JSON.stringify(genre));
});

// Add a new genre
app.post('/api/genres', (req, res) => {
    // Validate with schema
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

// Update a genre
app.put('/api/genres/:id', (req, res) => {
    // Check that genre exists
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Genre with given id was not found');

    genre.name = req.body.name;
    res.send(genre);
});

// Delete a genre
app.delete('/api/genres/:id', (req, res) => {
    // Check that genre exists
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Genre with given id was not found');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

/* JOI schema validators */

function validateGenre(genre) {
    const schema = {
        name: Joi.string().required()
    };
    return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));