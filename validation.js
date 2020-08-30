const Joi = require('@hapi/joi')
const registrationSchema = Joi.object().keys({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object().keys({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

module.exports.registerValidation = data => registrationSchema.validate(data)
module.exports.loginValidation = data => loginSchema.validate(data)