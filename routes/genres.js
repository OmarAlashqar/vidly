const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validatObjectId = require('../middleware/validateObjectId');
const { Genre, validate } = require('../models/genre');

/* API endpoints */

// Access a list of all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// Access a specific genre by ID
router.get('/:id', validatObjectId, async (req, res) => {
    // Check if genre exists
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('Genre with given id was not found');

    res.send(genre);
});

// Add a new genre
router.post('/', auth, async (req, res) => {
    // Validate with schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({ name: req.body.name });
    await genre.save()

    res.send(genre);
});

// Update a genre
router.put('/:id', [validatObjectId, auth], async (req, res) => {
    // Validate with schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Finds and updates the genre, and returns the updated genre
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!genre) return res.status(404).send('Genre with given id was not found');

    res.send(genre);
});

// Delete a genre
router.delete('/:id', [validatObjectId, auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Genre with given id was not found');

    res.send(genre);
});

module.exports = router;