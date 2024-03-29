const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    color:{
        type:String,

    },
    icon:{
        type:String
    },
    image:{
        type:String
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    }
},
{
    timestamps:true
});
categorySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals:true
})
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;