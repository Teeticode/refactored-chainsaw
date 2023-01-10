const mongoose = require('mongoose')

const phoneSchema = new mongoose.Schema({
    number:{
        type:Number,
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    createdAt:{type:Date, default:Date.now,index:{expires:300}}
},{
    timestamps:true
})

const Phone = mongoose.model('Phone', phoneSchema)
module.exports = Phone