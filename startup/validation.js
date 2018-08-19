const Joi = require('joi'); // schema http requests validation

module.exports = function() {
    Joi.objectId = require('joi-objectid')(Joi); 
}