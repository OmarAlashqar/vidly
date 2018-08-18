const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

Fawn.init(mongoose); // Fawn is used for two phase commits to emulate transactions

/* API endpoints */

// Grabbing a list of all rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateBooked');
    res.send(rentals);
});

// Creating a rental
router.post('/', auth, async (req, res) => {
    // Validate rental request
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { customerId, movieId } = req.body;

    // Checking the customer and movie
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(400).send('invalid customer id');

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(400).send('invalid movie id');
    if (movie.numberInStock === 0) return res.status(400).send('none left in stock'); 

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

    // transaction
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

            res.send(rental);
    } catch (ex) {
        return res.status(500).send('Something went wrong in the server');
    }
});

module.exports = router;