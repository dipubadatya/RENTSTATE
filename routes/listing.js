
require('dotenv').config()

const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js')
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require('../schema.js')
const loggedIn=require('../middlware.js')
const multer  = require('multer')
const {storage} =require('../cloudConfig.js')
const upload = multer({storage})




const validateListing = (req, res, next) => {

  let result = listingSchema.validate(req.body);
  if (result.error) {

    let errMsg = result.error.details.map(el => el.message).join(',')

    throw new expressError(404, errMsg);

  } else {
    next()
  }
}



router.get("/",
  wrapAsync(async (req, res) => {       
   
     let allListings = await Listing.find({}) 
  .populate('owner').populate('reviews')
    res.render("./listing/index.ejs", { allListings});
  })
);



router.get("/new",loggedIn, (req, res) => {
res.render('./listing/create.ejs')
});



router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id).populate({path:'reviews',populate:{
      path:'author'},
    }).populate('owner');

    if(!listing){
    req.flash('error', 'listing does not exist')
     res.redirect('/listings')
    }
    res.render("./listing/show.ejs", { listing });
  })
);


router.post("/", loggedIn, upload.single('listing[image]'),validateListing, async (req, res) => {
  try {
  
      let url = req.file.path;
      let filename = req.file.filename;
      let newData = new Listing(req.body.listing)
    
      newData.owner = req.user._id;
      console.log(req.user._id)
      newData.image = { url, filename };

      await newData.save();
     
      req.flash('success', 'New listing created');
 
      res.redirect("/listings");
  } catch (err) {
      console.error('Save Error:', err.message);
      req.flash('error', 'Failed to create listing');
      res.redirect("/listings/new");
  }
});



router.get(
  "/:id/edit",
  loggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
   

    let listing = await Listing.findById(id);
    
    
    if(!listing.owner._id.equals( res.locals.currUser._id)){
      req.flash('error', 'you are not a owner')
      res.redirect(`/listings/${id}`)
  }
    if(!listing){
      req.flash('error', 'listing does not exist')
       res.redirect('/listings')
      }
    res.render("./listing/edit.ejs", { listing });
  })
);

router.put(
  "/:id", upload.single('listing[image]'),
  wrapAsync(async (req, res) => {
    try{
    let { id } = req.params;
   
       let listing= await Listing.findById(id)

      
       if(!listing.owner._id.equals(res.locals.currUser._id)){
             req.flash('error','you are  not a owner')
    res.redirect(`/listings/${id}`);

       }
     
    let update = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    if(typeof req.file !=='undefined'){
      let url = req.file.path;
      let filename = req.file.filename;
      update.image={url,filename}
      update.save()
      }
    
    req.flash('success', ' Listing updated')

    res.redirect(`/listings/${id}`);
      }catch(err){
        
      }
  })
);

router.delete(
  "/:id",
  loggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;   
    let listing= await Listing.findById(id)
  
     
    if( !listing.owner._id.equals(res.locals.currUser._id)){
          req.flash('error','you are  not a owner')
 res.redirect(`/listings/${id}`);

    }else{
   await Listing.findByIdAndDelete(id);
    req.flash('success', ' listing  deleted')
    res.redirect("/listings");
    }
  })
);

module.exports = router;