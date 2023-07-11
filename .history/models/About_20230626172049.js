const mongoose = require('mongoose');
const User = require('./Users');
const aboutSchema = new mongoose.Schema({
    info:{
        type:String,
        required:true
    },
    about:{
        type:String,
        require:true
    },
    
    profession:[{
            type:String,
            required:true
    }],
    experience:{
        type:Number
    },
    projects:{
        type:Number
    },
    image:{
        type:String,
        require:true
    },
    cv:{
        type:String,
    },
    user:{
        type:Object,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
},{
    timestamps:true
});

const About = mongoose.model("About", aboutSchema);
module.exports = About;