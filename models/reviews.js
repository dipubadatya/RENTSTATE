const mongoose=require('mongoose');
const { type } = require('os');


const reviewSchema= new mongoose.Schema(
    {
        comments:{
            type:String,
        },         
   
        ratings:{
            type:Number,
            min:1,
            max:5
    
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports=mongoose.model('Review', reviewSchema);


