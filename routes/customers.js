const { Customer, validate } = require('../models/customerModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const customer = new Customer({ 
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone 
    });

    try {
        const result = await customer.save();
        res.send(result);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('error: could not insert into DB');
    }
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) res.status(404).send('error: customer not found') 
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const customer = await Customer.findByIdAndUpdate(
        req.params.id, 
        { 
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone 
        }, 
        { new: true }
    );

    if (!customer) res.status(404).send('error: customer not found') // return 404 and EXIT (hence return) if not found
    res.send(customer);
});

router.delete('/:id', async (req, res) => {    
    const result = await Customer.findByIdAndDelete(req.params.id);
    res.send(result);
});

module.exports = router;