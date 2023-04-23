const mongoose = "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type: Number,
        required:true,
        default:0
    },
    images:{
        type:Array,
    },
    color:{
        type:String,
        enum: ['Black', 'Brown', 'Red']
    },
    image:{
        type:String
    },
    countInStock:{
        type:Number,
        required:true,
        default:0
    },
    isDiscount:{
        type:Boolean,
        required:true,
        default:false
    },
    isFeatured:{
        type:Boolean,
        required:true,
        default:false
    },
    sold:{
        type:Number,
        default:0
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
    },
    rating:[{
        star:Number,
        postedBy:{type:mongoose.Schema.Types.ObjectId, ref:'User', require:true},
    }],
    reviews:[{
        
        comment:{
            type:String,
            
        },
        postedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            
        }
    }],
    category:{
        type:Object,
        required:true
    }
},
{
    timestamps:true
}
)
productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals:true
})
const Product = mongoose.model("Product", productSchema);
module.exports = Product;