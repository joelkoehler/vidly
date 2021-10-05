const { Genre, validate } = require('../models/genreModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const genre = new Genre({ name: req.body.name });

    try {
        const result = await genre.save();
        res.send(result);
    }
    catch (e) {
        return res.status(500).send('error: could not insert into DB');
    }
    //genres.push(genre);
});

router.get('/:id', async (req, res) => {
    //const genre = genres.find(c => c.id === parseInt(req.params.id));
    const genre = await Genre.findById(req.params.id);

    if (!genre) res.status(404).send('error: genre not found') // return 404 and EXIT (hence return) if not found

    res.send(genre);
});

router.put('/:id', async (req, res) => {
    //const genre = genres.find(c => c.id === parseInt(req.params.id));
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

    if (!genre) res.status(404).send('error: genre not found') // return 404 and EXIT (hence return) if not found

    //genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    //const genre = genres.find(c => c.id === parseInt(req.params.id));
    
    const result = await Genre.findByIdAndDelete(req.params.id);
    //genres.splice(genres.indexOf(genre), 1);
    res.send(result);
});

module.exports = router;