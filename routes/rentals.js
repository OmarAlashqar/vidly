const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../models/movie');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

/* API endpoints */

// Grabbing a list of all rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateBooked');
    res.send(rentals);
});

// Creating a rental
router.post('/', async (req, res) => {
    // Validate rental request
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { customerId, movieId } = req.body;

    // Checking the customer and movie
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(400).send('invalid customer id');

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(400).send('invalid movie id');

    // Creating the rental
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    rental = await rental.save();

    movie.numberInStock--;
    movie.save();

    res.send(rental);
});

module.exports = router;