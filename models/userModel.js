const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({ 
    name: { 
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 50 
    },
    email: { 
        type: String, 
        required: true,
        minlength: 5, 
        maxlength: 255, 
        unique: true, 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 1024 
    }
});
 
const User = mongoose.model('User', userSchema);

function validate(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    const { error } = schema.validate(user);
    if (error) return error.details[0].message;
}

module.exports.User = User;
module.exports.validate = validate;