const mongoose = require('mongoose');
const Joi = require('joi');

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;
const MIN_PHONE_LENGTH = 1;
const MAX_PHONE_LENGTH = 15;

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 200;
const MIN_UTIL = 0; // used for numberInstock and dailyRentalRate
const MAX_UTIL = 5000;

/* Mongoose Schema */
const Rental = mongoose.model('rental', {
    customer: {
        type: {
            name: {
                type: String,
                required: true,
                minlength: MIN_NAME_LENGTH,
                maxlength: MAX_NAME_LENGTH
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: MIN_PHONE_LENGTH,
                maxlength: MAX_PHONE_LENGTH
            }
        },
        required: true
    },
    movie: {
        type: {
            title: {
                type: String,
                required: true,
                minlength: MIN_TITLE_LENGTH,
                maxlength: MAX_TITLE_LENGTH
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                minlength: MIN_UTIL,
                maxlength: MAX_UTIL
            }
        },
        required: true
    },
    dateBooked: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: Date,
    rentalFee: {
        type: Number,
        min: 0
    }
});

/* JOI schema validators */
function validate(rental) {
    const schema = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required()

    };
    return Joi.validate(rental, schema);
}

module.exports = { Rental, validate };