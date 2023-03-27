const mongoose = require('mongoose')
const Tiers = require('./Tiers')

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
    amount:{
        type:Number,
        required:true
    },
    isPaid:{
        type:Boolean,
        require:true,
        default:false
    }
},{
    timestamps:true
});

const Premium = mongoose.model('Premium',premiumSchema)
module.exports = Premium