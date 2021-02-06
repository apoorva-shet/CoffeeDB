const Joi = require('joi');

const registerUserSchema = Joi.object().keys({
  email: Joi.string().email().max(50).required(),
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().min(8).required(),
  passwordRepeat: Joi.any().valid(Joi.ref('password')).required(),
  role:Joi.string().max(10).required(),
});

module.exports = {
  registerUser: (params) => { return registerUserSchema.validate(params); }
}