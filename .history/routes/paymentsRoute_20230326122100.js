const express = require('express')
const verifyUser = require('../middlewares/jwtVerify')
const paymentRoutes = express.Router()
const Premium = require('../models/Premium')

paymentRoutes.post('/pay',verifyUser,(req,res)=>{

})