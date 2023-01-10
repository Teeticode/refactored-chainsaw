const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    user:{
        type:Object,
        require:true
    }
},{
    timestamps:true
})

const Transaction = mongoose.mpdel('Transaction', transactionSchema)
module.exports = Transaction