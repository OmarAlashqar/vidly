const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Customer, validate } = require('../models/customer');

/* API endpoints */

// Access a list of all customers
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// Access a specific customer by ID
router.get('/:id', async (req, res) => {
    // Check if customer exists
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('customer with given id was not found');

    res.send(customer);
});

// Add a new customer
router.post('/', auth, async (req, res) => {
    // Validate with schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, phone, isGold } = req.body;
    const customer = new Customer({ name, phone, isGold });
    await customer.save()

    res.send(customer);
});

// Update a customer
router.put('/:id', auth, async (req, res) => {
    // Validate with schema
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Finds and updates the customer, and returns the updated customer
    const { name, phone, isGold } = req.body;
    const customer = await Customer
        .findByIdAndUpdate(req.params.id, { name, phone, isGold }, { new: true });
    if (!customer) return res.status(404).send('customer with given id was not found');

    res.send(customer);
});

// Delete a customer
router.delete('/:id', [auth, admin], async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('customer with given id was not found');

    res.send(customer);
});

module.exports = router;