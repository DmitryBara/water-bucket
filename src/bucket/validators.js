const { Joi } = require('express-validation')

const BucketValidation = {
  body: Joi.object({
    X: Joi.number().integer().min(1).max(100).required(),
    Y: Joi.number().integer().min(1).max(100).required(),
    Z: Joi.number().integer().min(1).max(100).required(),
  }),
}

module.exports = { BucketValidation }