const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Tiers = require('../models/Tiers');
const verifyUser = require('../middlewares/jwtVerify');

router.get('/', (req,res)=>{
    Tiers.find()
    .then((tiers)=>{
        return res.status(200).json({tiers:tiers});
    })
    .catch((err)=>{
        return res.status(500).json({error:'Something Went Wrong'})
    })
})
