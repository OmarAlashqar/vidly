const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const MIN_UTIL_LENGTH = 1; // used for name, and email
const MAX_UTIL_LENGTH = 50;
const MIN_PASS_LENGTH = 5;
const MAX_PASS_LENGTH = 255;
const PASS_HASHED_LENGTH = 1024;

/* Mongoose Schema */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: MIN_UTIL_LENGTH,
        maxlength: MAX_UTIL_LENGTH
    },
    email: {
        type: String,
        required: true,
        minlength: MIN_UTIL_LENGTH,
        maxlength: MAX_UTIL_LENGTH,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: MIN_UTIL_LENGTH,
        maxlength: PASS_HASHED_LENGTH
    }
});

userSchema.methods.genAuthToken = function() {
    return jwt.sign({
        _id: this._id
    }, config.get('jwtPrivateKey'));  
};

const User = mongoose.model('user', userSchema);

/* JOI schema validators */
function validate(user) {
    const schema = {
        name: Joi.string().min(MIN_UTIL_LENGTH).max(MAX_UTIL_LENGTH).required(),
        email: Joi.string().email().min(MIN_UTIL_LENGTH).max(MAX_UTIL_LENGTH).required(),
        password: Joi.string().min(MIN_PASS_LENGTH).max(MAX_PASS_LENGTH).required()
    };
    return Joi.validate(user, schema);
}

module.exports = { User, validate };