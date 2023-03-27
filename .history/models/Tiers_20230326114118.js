const mongoose = require('mongoose');

const tiersSchema = new mongoose.Schema({
    name:{

        type:String,
        unique:true,
        required:true
    },
    amount:{
        type:Number,
        require:true
    }
},{
    timestamps:true
})

const Tiers = mongoose.model('Tiers', tiersSchema);

module.exports = Tiers