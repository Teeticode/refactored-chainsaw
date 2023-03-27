const express = require('express')
const verifyUser = require('../middlewares/jwtVerify')
const paymentRoute = express.Router()
const Premium = require('../models/Premium')

paymentRoute.post('/pay',verifyUser,(req,res)=>{
    
})

paymentsRoute.post('/callback',verifyUser,(req,res)=>{
    const callback = req.body
    return res.status(200).json({callback})
})

module.exports = paymentsRoute