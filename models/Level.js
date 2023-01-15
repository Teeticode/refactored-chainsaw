const mongoose = require('mongoose');

const levelsSchema = new mongoose.Schema({
    name:{

        type:String,
        unique:true,
        required:true
    }
},{
    timestamps:true
})

const Level = mongoose.model('Level', levelsSchema);

module.exports = Level