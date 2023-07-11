const express = require('express')
const verifyUser = require('../middlewares/jwtVerify')
const dotenv = require('dotenv')
dotenv.config()
const paymentRoutes = express.Router()
const Premium = require('../models/Premium')
const axios = require('axios')


paymentRoutes.get('/token',async (req,res) =>{
    const secret = process.env.MPESA_SECRET
    const consumer_key = process.env.MPESA_KEY
    const auth = new Buffer.from(`${consumer_key}:${secret}`).toString("base64")
    await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',{
        headers:{
            authorization:`Basic ${auth}`
        }
    })
    .then(data=>{
        console.log(data.data.access_token);
        const token = data.data.access_token;
        return res.status(200).json({token:token})
    })
    .catch(error=>{
        console.log(error)
        return res.json({error:error.message})
    })
})


paymentRoutes.post('/stk',async (req,res)=>{
    const phone = req.body.phone
    const amount = req.body.amount
    const token = req.body.token
    const short_code = process.env.SHORT_CODE
    const pass_key = process.env.PASS_KEY 
    const date = new Date()
    const timestamp = 
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
    const password = new Buffer.from(short_code + pass_key + timestamp).toString("base64")
    await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {    
            "BusinessShortCode": short_code,    
            "Password": password,    
            "Timestamp": timestamp,    
            "TransactionType": "CustomerPayBillOnline",    
            "Amount": amount,    
            "PartyA":`254${phone}`,    
            "PartyB": short_code,    
            "PhoneNumber": `254${phone}`,    
            "CallBackURL": "https://f215-80-240-202-238.in.ngrok.io/api/v1/payments/callback",    
            "AccountReference": `254${phone}`,    
            "TransactionDesc":"Test"
         },{
            headers:{
                Authorization: `Bearer ${token}`
            }
         }
    )
    .then((data)=>{
        res.status(200).json(data.data)
    })
    .catch((err)=>{
        console.log(err.message)
        res.status(400).json(err.message)
    })
})

paymentRoutes.post('/callback',(req,res)=>{
    const callback = req
    console.log(callback)
})

module.exports = paymentRoutes