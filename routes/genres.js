const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const MIN_GENRE_LENGTH = 1;
const MAX_GERNE_LENGTH = 50;

/* JOI schema validators */
function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(MIN_GENRE_LENGTH).max(MAX_GERNE_LENGTH).required()
    };
    return Joi.validate(genre, schema);
}

/* Mongoose Schema */
const Genre = mongoose.model('genre', {
    name: {
        type: String,
        required: true,
        minlength: MIN_GENRE_LENGTH,
        maxlength: MAX_GERNE_LENGTH
    }
});

/* API endpoints */

// Access a list of all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// Access a specific genre by ID
router.get('/:id', async (req, res) => {
    // Check if genre exists
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('Genre with given id was not found');

    res.send(genre);
});

// Add a new genre
router.post('/', async (req, res) => {
    // Validate with schema
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({ name: req.body.name });
    res.send(await genre.save());
});

// Update a genre
router.put('/:id', async (req, res) => {
    // Validate with schema
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Finds and updates the genre, and returns the updated genre
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!genre) return res.status(404).send('Genre with given id was not found');

    res.send(genre);
});

// Delete a genre
router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Genre with given id was not found');

    res.send(genre);
});

module.exports = router;