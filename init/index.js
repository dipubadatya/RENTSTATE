const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');
const User= require('../models/user.js')


main().then(()=>{
    console.log('db connect succsesfuly')
 })
 .catch(err=>console.log(err));


async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
   })
 
}


 initDb= async ()=>{
   //  await Listing.deleteMany({})
initData.data=initData.data.map((obj)=>({ ...obj, owner:"66d047249288c4af460e728a"}))
    await Listing.insertMany(initData.data)
    console.log('data initialized')
}

initDb()