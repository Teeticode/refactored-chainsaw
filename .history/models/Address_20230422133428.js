const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    name:{
        type:String, 
        require:true
    },
    street_name:{
        type:String,
    },
    city:{
        type:String
    },
    town:{
        type:String
    },
    county:{
        type:String
    },
    postal_code:{
        type:String
    },
    country:{
        type:String,
        require:true
    }
})

const Address = mongoose.model('Address', addressSchema)
module.exports = Address