const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/user');

/* API endpoints */

// Authenticate a user
router.post('/', async (req, res) => {
    // Validate with schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    // check for existence of email
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send('invalid email or password');

    // validate password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('invalid email or password');

    const token = user.genAuthToken();
    res.send(token);
});


/* Joi validators */
const MIN_UTIL_LENGTH = 1; // used for name, and email
const MAX_UTIL_LENGTH = 50;
const MIN_PASS_LENGTH = 5;
const MAX_PASS_LENGTH = 255;

function validate(req) {
    const schema = {
        email: Joi.string().email().min(MIN_UTIL_LENGTH).max(MAX_UTIL_LENGTH).required(),
        password: Joi.string().min(MIN_PASS_LENGTH).max(MAX_PASS_LENGTH).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;