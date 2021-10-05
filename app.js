const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongoose = require('mongoose');

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1); // 0 means sucsess, 1 is error often
}

app.use(express.json()); // tells app to use middleware
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);


mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useUnifiedTopology: true }) // returns promise
    .then(() => console.log('connected to mongo db...'))
    .catch(err => console.error('could not connect to mongo db...', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));