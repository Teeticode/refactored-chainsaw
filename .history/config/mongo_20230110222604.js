const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const MONGO_URI = process.env.MONGO_URI
mongoose.set('strictQuery',false)
const connectToDb = async ()=>{
    try{
        const connection = await mongoose.connect(MONGO_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
        })
        console.log('connected to portfolio')
    }catch(error){
        console.error(`Error is ${error.message}`);
        process.exit(1)
    }
}

module.exports = connectToDb