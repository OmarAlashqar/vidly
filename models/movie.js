const mongoose = require('mongoose');
const Joi = require('joi');

const { genreSchema } = require('./genre');

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 200;
const MIN_UTIL = 0; // used for numberInstock and dailyRentalRate
const MAX_UTIL = 5000;

/* Mongoose Schema */
const Movie = mongoose.model('movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: MIN_TITLE_LENGTH,
        maxlength: MAX_TITLE_LENGTH
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: [MIN_UTIL, 'Number in stock must be gte 0'],
        max: MAX_UTIL
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: [MIN_UTIL, 'Rental rate must be gte 0'],
        max: MAX_UTIL
    }
}));

/* JOI schema validators */
function validate(movie) {
    const schema = {
        title: Joi.string().min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(MIN_UTIL).max(MAX_UTIL).required(),
        dailyRentalRate: Joi.number().min(MIN_UTIL).max(MAX_UTIL).required(),
    };
    return Joi.validate(movie, schema);
}

module.exports = { Movie, validate };