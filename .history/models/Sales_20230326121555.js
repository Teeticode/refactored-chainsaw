const mongoose = require('mongoose')
const Tiers = require('./Tiers')

const salesSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
    },
    number:{
        type:String,
    },
    cardNumber:{
        type:String,
    },
    amount:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

const Sales = mongoose.model('Sales',salesSchema)
module.exports = Sales