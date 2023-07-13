const express = require('express');
const mongoose = require('mongoose');
const Premium = require('../models/Premium');
const User = require('../models/Users');
const verifyUser = require('../middlewares/jwtVerify');
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

router.get('/verify',verifyUser, (req,res)=>{
    console.log(req.user)
    Premium.findOne({owner:req.user})
    .then((premUser)=>{
        if(premUser){
            User.findByIdAndUpdate(req.user,{
                premium:true
            },{new:true})
            .then((updatedUser)=>{
                if(updatedUser){
                    return res.status(200).json({premium:true})
                }else{
                    return res.status(404).json({error:'Not Found'})
                }
            }).catch((err)=>{
                return res.status(500).json({error:err})
            })
        }else{
            User.findByIdAndUpdate(req.user,{
                premium:false
            },{new:true})
            .then((updatedUser)=>{
                if(updatedUser){
                    return res.status(200).json({premium:false})
                }else{
                    return res.status(404).json({error:'Not Found'})
                }
            }).catch((err)=>{
                return res.status(500).json({error:err})
            })
        }
    })
    .catch((err)=>{
        return res.status(500).json({error:err})
    })
})

module.exports = router;