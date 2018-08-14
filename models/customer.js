const mongoose = require('mongoose');
const Joi = require('joi');

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;
const MIN_PHONE_LENGTH = 1;
const MAX_PHONE_LENGTH = 15;

/* Mongoose Schema */
const Customer = mongoose.model('customer', {
    name: {
        type: String,
        required: true,
        minlength: MIN_NAME_LENGTH,
        maxlength: MAX_NAME_LENGTH
    },
    phone: {
        type: Number,
        required: true,
        minlength: MIN_PHONE_LENGTH,
        maxlength: MAX_PHONE_LENGTH
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

/* JOI schema validators */
function validate(customer) {
    const schema = {
        name: Joi.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH).required(),
        phone: Joi.string().min(MIN_PHONE_LENGTH).max(MAX_PHONE_LENGTH).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

module.exports = { Customer, validate };