const express = require('express')
const verifyUser = require('../middlewares/jwtVerify')
const paymentRoutes = express.Router()
const Premium = require('../models/Premium')

paymentRoutes.post('/pay',verifyUser,(req,res)=>{
    
})

paymentRoute.post('/callback',verifyUser,(req,res)=>{
    const callback = req.body
    return res.status(200).json({callback})
})

module.exports = paymentRoute