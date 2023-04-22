const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    }
})