const mongoose = require('mongoose');

const tiersSchema = new mongoose.Schema({
    name:{

        type:String,
        unique:true,
        required:true
    }
},{
    timestamps:true
})

const Tiers = mongoose.model('Tiers', tiersSchema);

module.exports = Tiers