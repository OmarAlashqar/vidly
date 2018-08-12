const express = require('express');
const router = express.Router();

// Fake database model for now
const genres = [
    { id: 1, name: 'action' },
    { id: 2, name: 'adventure' },
    { id: 3, name: 'comedy' },
    { id: 4, name: 'sci-fi' }
];

/* API endpoints */

// Access a list of all genres
router.get('/', (req, res) => {
    res.send(JSON.stringify(genres));
});

// Access a specific genre by ID
router.get('/:id', (req, res) => {
    // Check if genre exists
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Genre with given id was not found');

    res.send(JSON.stringify(genre));
});

// Add a new genre
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
    // Check that genre exists
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Genre with given id was not found');

    genre.name = req.body.name;
    res.send(genre);
});

// Delete a genre
router.delete('/:id', (req, res) => {
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

module.exports = router;