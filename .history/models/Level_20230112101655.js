const mongoose = require('mongoose');

const levelsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Level = mongoose.model('Level', levelsSchema);

module.exports = Level