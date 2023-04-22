const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    token:{
        type:String,
        require:true
    },
    verified:{
        type:Boolean,
        require:true,
        default:false
    },
    premium:{
        type:Boolean,
        require:true,
        default:false
    },
    role:{
        type:String,
        require:true,
        default:'user'
    },
    cart:{
        type: Array,
        default: []
    },
    address:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address'
    }],
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Products'
    }]

},{
    timestamps:true
});

userSchema.methods.matchPassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}
const User = mongoose.model('User',userSchema);
module.exports = User;