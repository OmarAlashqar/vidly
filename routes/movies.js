const express = require('express');
const router = express.Router();
const { Genre } = require('../models/genre');
const { Movie, validate } = require('../models/movie');

/* API endpoints */

// Access a list of all movies
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

// Access a specific movie by ID
router.get('/:id', async (req, res) => {
    // Check if movie exists
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('movie with given id was not found');

    res.send(movie);
});

// Add a new movie
router.post('/', async (req, res) => {
    // Validate with schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Try to find the genre specified
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('invalid genre');

    const { title, numberInStock, dailyRentalRate } = req.body;
    const movie = new Movie({
        title, numberInStock, dailyRentalRate,
        genre: {
            id: genre._id,
            name: genre.name
        }
    });
    await movie.save()

    res.send(movie);
});

// Update a movie
router.put('/:id', async (req, res) => {
    // Validate with schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Try to find the genre specified
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('invalid genre');

    // Finds and updates the movie, and returns the updated movie
    const { title, numberInStock, dailyRentalRate } = req.body;
    const movie = await Movie
        .findByIdAndUpdate(req.params.id, {
            title, numberInStock, dailyRentalRate,
            genre: {
                id: genre._id,
                name: genre.name
            }
        }, { new: true });
    if (!movie) return res.status(404).send('movie with given id was not found');

    res.send(movie);
});

// Delete a movie
router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send('movie with given id was not found');

    res.send(movie);
});

module.exports = router;