const express=require('express');
const router=express.Router();
const User=require('../models/user.js')
const passport = require ('passport');
// const {saveUrl}= require('../middlware.js')
// const wrapAsync = require('../utils/wrapAsync.js');
// const LocalStrategy=require('passport-local');




router.get('/signup',(req,res)=>{
    res.render('./user/signup.ejs')
})

router.post('/signup',(async(req,res)=>{
    try{
    const {username,email,password}=req.body
    const newUser= new User({username,email})
     const registerUser= await User.register(newUser,password)
     req.login(registerUser,(err)=>{
     if(err){
        return next(err)
     }else{
     req.flash('success','thanks for signUp')
     return res.redirect('/listings')
     }
     })
     
    }catch(e){
        req.flash('error',e.message="user already exist")
       res.redirect('/signup')

    }
}))


router.get('/login',(req,res)=>{
    
    res.render('./user/login.ejs')
})


router.post('/login',
    passport.authenticate('local', {
        failureRedirect:'/login',
         failureFlash:true
    }),
   async (req, res) => {
    if(res.locals.redirectUrl){
      return  res.redirect(res.locals.redirectUrl)
    }else{
       return res.redirect('/listings')


    }
})


router.get('/logout',(req,res)=>{
req.logout((err)=>{
     if (err) {
        return next(err)
        
     }
     req.flash('success', 'loged out')
     res.redirect('/listings')
})


})



module.exports=router;