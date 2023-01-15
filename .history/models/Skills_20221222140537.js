const mongoose = require('mongoose');

const skillsRouter = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    skills:[{
        name:{
            type:String
        },
        level:{
            type:String
        }
    }]
},{
    timestamps:true
})

const Skill = mongoose.model('Skill', skillsRouter);

module.exports = Skill