const { Rental, validate } = require('../models/rentalModel');
const { Customer } = require('../models/customerModel');
const { Movie } = require('../models/movieModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');

Fawn.init('mongodb://localhost/vidly');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send(error);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send(error);

    if (movie.numberInStock < 1) {
        return res.status(400).send('Movie not in stock');
    }

    const rental = new Rental({ 
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        rentalFee: movie.dailyRentalRate
    });

    try { // Fawn chains these together
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        }) // there is also a .remove() if you want it
        .run(); // run is NEEDED for this to actually run
        res.send(rental);
    }
    catch(e) {
        res.status(500).send('something failed -- internal server error')
    }
});

module.exports = router;
