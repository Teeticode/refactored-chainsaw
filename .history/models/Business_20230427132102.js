const mongoose = require("mongoose");

const businessSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String
    },
    logo:{
        type:String
    },
    owner:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    }
},
{
    timestamps:true
})

businessSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

businessSchema.set('toJSON', {
    virtuals:true
})

const Business = mongoose.model("Business", businessSchema)
module.exports = Business
