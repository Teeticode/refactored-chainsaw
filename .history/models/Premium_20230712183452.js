const mongoose = require('mongoose')
const Tiers = require('./Tiers')
const User = require('./Users')

const premiumSchema = new mongoose.Schema({
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
    tier:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tiers',
        require:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    }
},{
    timestamps:true
});

const Premium = mongoose.model('Premium',premiumSchema)
module.exports = Premium