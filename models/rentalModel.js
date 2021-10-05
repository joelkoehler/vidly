const mongoose = require('mongoose');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({ 
    customer: { 
        type: new mongoose.Schema({ // Opt for a hybrid approach here since directly using the customerModel will prtentially bring in a LOT of unneeded data
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
        }), 
        required: true, 
    },
    movie: {
        type: new mongoose.Schema({
            title: { 
                type: String, 
                required: true, 
                minlength: 5, 
                maxlength: 225 
            },
            dailyRentalRate: {
                type: Number,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validate(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    const { error } = schema.validate(rental);
    if (error) return error.details[0].message;
}

module.exports.Rental = Rental;
module.exports.validate = validate;