const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/userModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    let user = await User.findOne({ email: req.body.email });
    if (user == null) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password); // if equal, returns true
    if (!validPassword) return res.status(400).send('Invalid email or password');

    // Generate JWT
    const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey')) // pass it a payload & use config to pass env var

    res.send(token);
});

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    const { error } = schema.validate(user);
    if (error) return error.details[0].message;
}

module.exports = router;