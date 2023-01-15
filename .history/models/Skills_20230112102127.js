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
            ref:'Level',
            type:mongoose.Schema.Types.ObjectId,
            require:true
        }
    }]
},{
    timestamps:true
})

const Skill = mongoose.model('Skill', skillsRouter);

module.exports = Skill