const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/userModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    // Make sure this uer isn't already registered
    let user = await User.findOne({ email: req.body.email });
    if (user != null) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10); 
    user.password = await bcrypt.hash(user.password, salt);

    try {
        await user.save();
        const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey')) // pass it a payload & use config to pass env var
        res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
    }
    catch (e) {
        return res.status(500).send('error: could not insert into DB');
    }
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) res.status(404).send('error: user not found') 
    res.send(user);
});



router.delete('/:id', async (req, res) => {    
    const result = await User.findByIdAndDelete(req.params.id);
    res.send(result);
});

module.exports = router;