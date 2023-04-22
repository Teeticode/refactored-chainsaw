const mongoose = require('mongoose')
const Tiers = require('./Tiers')
const User = require('./Users')

const premiumSubscriberSchema = new mongoose.Schema({
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
    amount:{
        type:Number,
        required:true
    },
    isPaid:{
        type:Boolean,
        require:true,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    }
},{
    timestamps:true
});

const Premium = mongoose.model('Premium',premiumSubscriberSchema)
module.exports = Premium