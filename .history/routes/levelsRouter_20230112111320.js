const express = require('express')
const router = express.Router()
const Level = require('../models/Level')
const verifyUser = require('../middlewares/jwtVerify')
router.get('/',verifyUser,(req,res)=>{
    if(req.admin === true){

    }else{
        return res.status(401).json({error:'Not authorized'})
    }
})

module.exports = router