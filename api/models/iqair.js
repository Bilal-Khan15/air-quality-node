const Joi = require("joi");
const validate = require("../../middleware/validate");
const mongoose = require('mongoose');

const iqairSchema = mongoose.Schema({
    datetime: {
        type: Date,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    result: {
        type: mongoose.Schema({
            ts: {
                type: Date,
                required: true
            },
            aqius: {
                type: Number,
                required: true,
                min: 0,
            },
            mainus: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 50
            },
            aqicn: {
                type: Number,
                required: true,
                min: 0,
            },
            maincn: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 50
            }
        })
    }
});

const Iqair = mongoose.model('Iqair', iqairSchema);

function validateIqair(iqair) {
    const schema = {
        datetime: Joi.date()
            .required(),
        city: Joi.string()
            .min(2)
            .max(50)
            .required(),
        result: Joi.object()
            .required()
    };
  
    return Joi.validate(iqair, schema);
}

exports.Iqair = Iqair;
exports.validate = validateIqair;