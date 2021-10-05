const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genreModel');

const movieSchema = new mongoose.Schema({ 
    title: { 
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 225 
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validate(customer) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    const { error } = schema.validate(customer);
    if (error) return error.details[0].message;
}

module.exports.Movie = Movie;
module.exports.validate = validate;