import mongoose from "mongoose";


const orderSchema = mongoose.Schema({
    user:{
        ref:"User",
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    orderItems: [
        {
            name:{type:String, required:true},
            qty:{type:Number, required:true},
            image:{type:String, required:true},
            price:{type:Number, required:true},
            product:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"Product"
            },
        },
    ],
    paymentResult:{
        id:{type:String},
        status:{type:String},
        update_time: {type:String},
        email_address: {type:String}
    }
},
{
    timestamps:true
}
)
orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals:true
})
const Order = mongoose.model("Order", orderSchema);
export default Order;