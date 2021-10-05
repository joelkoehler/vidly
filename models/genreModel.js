const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
});

const Genre = mongoose.model('Genre', genreSchema);
// compiles schema into a model
    // first are is singular name of collection that this model is for
    // second is schema that defines the shape of document 

function validate(genre) {
    const schema = Joi.object({
        id: Joi.number().integer(),
        name: Joi.string().min(3).required()
    });
    const { error } = schema.validate(genre);
    if (error) return error.details[0].message;
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validate;