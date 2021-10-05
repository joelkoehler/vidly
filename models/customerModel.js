const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({ 
    isGold: { 
        type: Boolean, 
        default: false, 
    },
    name: { 
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 50 
    },
    phone: { 
        type: String, 
        required: true, 
        minlength: 10, 
        maxlength: 10 
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validate(customer) {
    const schema = Joi.object({
        isGold: Joi.boolean(),
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
    });
    const { error } = schema.validate(customer);
    if (error) return error.details[0].message;
}

module.exports.Customer = Customer;
module.exports.validate = validate;