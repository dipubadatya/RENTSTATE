const express =require('express');
const router =express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const loggedIn=require('../middlware')

const { reviewSchema } = require('../schema.js');



const validateReview = (req, res, next) => {

    let result = reviewSchema.validate(req.body);
    if (result.error) {
  
      let errMsg = result.error.details.map(el => el.message).join(',')
  
      throw new expressError(404, errMsg);
  
    } else {
      next()
    }
  }


  



//for reviews 
//post routes
router.post('/',loggedIn,validateReview,wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let {id}= req.params
  
  let newReviews = new Review(req.body.review)
  newReviews.author=req.user._id;
  console.log(newReviews)
  listing.reviews.push(newReviews)
  await newReviews.save()
  await listing.save()
  req.flash('success', ' review created')

  res.redirect(`/listings/${id}`)

}))


// review delete
router.delete(
  "/:reviewId",loggedIn,
  wrapAsync(async (req, res) => {
    let { id ,reviewId} = req.params;
    let review= await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
       req.flash('error', 'you dont have a permisiion');
      return res.redirect(`/listings/${id}`)
       
    }else{
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', ' review deleted')
   res.redirect(`/listings/${id}`)
    }
  })

);
module.exports=router;