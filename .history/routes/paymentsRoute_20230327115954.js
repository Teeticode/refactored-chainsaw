const express = require('express')
const verifyUser = require('../middlewares/jwtVerify')
const dotenv = require('dotenv')
dotenv.config()
const paymentRoutes = express.Router()
const Premium = require('../models/Premium')
const { default: axios } = require('axios')

const generateToken = async (req,res,next) =>{
    const secret = process.env.MPESA_SECRET
    const consumer_key = process.env.MPESA_KEY
    const auth = new Buffer.from(secret + consumer_key).toString("base64")
    await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',{
        headers:{
            Authorization:`Basic ${auth}`
        }
    })
}
paymentRoutes.post('/stk',generateToken,async (req,res)=>{
    const phone = req.body.phone
    const amount = req.body.amount

    const short_code = process.env.SHORT_CODE
    const pass_key = process.env.PASS_KEY 
    const password = new Buffer.from(short_code + pass_key + timestamp).toString("base64")
    const date = new Date()
    const timestamp = date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + data.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

    await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {    
            "BusinessShortCode": short_code,    
            "Password": password,    
            "Timestamp": timestamp,    
            "TransactionType": "CustomerBuyGoodsOnline",    
            "Amount": amount,    
            "PartyA":`254${phone}`,    
            "PartyB": short_code,    
            "PhoneNumber": `254${phone}`,    
            "CallBackURL": "https://mydomain.com/pat",    
            "AccountReference":"Test",    
            "TransactionDesc":"Test"
         },{
            headers:{
                Authorization: `Bearer ${token}`
            }
         }
    )
})

paymentRoutes.post('/callback',verifyUser,(req,res)=>{
    const callback = req.body
    return res.status(200).json({callback})
})

module.exports = paymentRoutes