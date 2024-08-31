const joi= require('joi');

module.exports.listingSchema= joi.object ({
  listing:joi.object({
           title:joi.string().required(),
           description:joi.string().required(),
           image:joi.string().allow("",null),
           price:joi.number().required().min(0),
           country:joi.string().required(),
           location:joi.string().required(),
}).required(),

});
        
module.exports.reviewSchema= joi.object ({
  review:joi.object({  
           ratings:joi.number().required().min(1).max(5),
           comments:joi.string().required(),
        
}).required(),


});         



