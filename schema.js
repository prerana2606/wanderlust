const Joi = require('joi');

module.exports.listingSchema = Joi.object({  // post validation for new creation

        title: Joi.string().min(3).required(),
        description: Joi.string().required(),
        image:Joi.object({
                url: Joi.string().allow('', null), // at the end mongoose will add the default value before inserting in db, till that time null or empty value is allowed.
                filename:Joi.string().allow("",null)
        }),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),

}).required()

module.exports.commentSchema = Joi.object({  // comments validation 
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
}).required()