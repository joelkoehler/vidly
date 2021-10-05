const { Movie, validate } = require('../models/movieModel');
const { Genre } = require('../models/genreModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send(error);

    const movie = new Movie({ 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    try {
        await movie.save();
        res.send(movie);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('error: could not insert into DB');
    }
});

module.exports = router;
