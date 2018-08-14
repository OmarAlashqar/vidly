const mongoose = require('mongoose');
const Joi = require('joi');

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;

/* Mongoose Schema */
const genreSchema = {
    name: {
        type: String,
        required: true,
        minlength: MIN_NAME_LENGTH,
        maxlength: MAX_NAME_LENGTH
    }
};
const Genre = mongoose.model('genre', genreSchema);

/* JOI schema validators */
function validate(genre) {
    const schema = {
        name: Joi.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH).required()
    };
    return Joi.validate(genre, schema);
}

module.exports = { Genre, validate, genreSchema };