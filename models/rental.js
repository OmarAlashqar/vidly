const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;
const MIN_PHONE_LENGTH = 1;
const MAX_PHONE_LENGTH = 15;

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 200;
const MIN_UTIL = 0; // used for numberInstock and dailyRentalRate
const MAX_UTIL = 5000;

/* Mongoose Schema */
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
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
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
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
        }),
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
rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}

rentalSchema.methods.return = function() {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateBooked, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('rental', rentalSchema);

/* JOI schema validators */
function validate(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()

    };
    return Joi.validate(rental, schema);
}

module.exports = { Rental, validate };