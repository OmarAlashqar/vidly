const express = require('express');
const router = express.Router();
const Joi = require('joi');
const winston = require('winston');
const validate = require('../middleware/validate')
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');

/* JOI validators */
function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(req, schema);
}

// Request a movie return
router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const { customerId, movieId } = req.body;

    const rental = await Rental.lookup(customerId, movieId);

    // rental doesn't exist
    if (!rental) return res.status(404).send('rental not found');

    // return already processed
    if (rental.dateReturned) return res.status(400).send('return already processed');

    rental.return();
    await rental.save();

    await Movie.update({ _id: movieId }, {
        $inc: { numberInStock: 1 }
    });

    res.status(200).send(rental);
});

module.exports = router;