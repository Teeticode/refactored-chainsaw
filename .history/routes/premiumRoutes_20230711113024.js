const express = require('express');
const mongoose = require('mongoose');
const Premium = require('../models/Premium');
const router = express.Router();

router.get('/', (req,res)=>{
    Premium.find()
    .then((prem)=>{
        return res.status(200).json({premiums:prem})
    })
    .catch((err)=>{
        return res.status(500).json({error:'Something Went Wrong'})
    })
})


module.exports = router;