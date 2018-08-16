const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { User, validate } = require('../models/user');

/* API endpoints */

// Register a new user
router.post('/', async (req, res) => {
    // Validate with schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).send('email already registered');

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10); // generate a salt
    user.password = await bcrypt.hash(password, salt); // hash the password

    await user.save();

    const token = user.genAuthToken(); // auth user on registration
    res.header('x-auth-token', token)
        .send({ _id: user._id, name: user.name, email: user.email });
});

module.exports = router;