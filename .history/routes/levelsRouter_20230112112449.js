const express = require('express')
const router = express.Router()
const Level = require('../models/Level')
const verifyUser = require('../middlewares/jwtVerify')
router.get('/',verifyUser,(req,res)=>{
    if(req.admin === true){
        Level.find({})
        .then((levels)=>{
            if(levels){
                res.status(200).json({levels:levels})
            }else{
                return res.status(404).json({error:'Not found'})
            }
        }).catch((err)=>{
            res.status(500).json({error:'Something went wrong'})
        })
    }else{
        return res.status(401).json({error:'Not authorized'})
    }
})

router.post('/',verifyUser,(req,res)=>{
    if(!req.body.name){
        return res.status(500).json({error:'Fill in required fields'})
    }
    if(req.admin === true){
        Level.findOne({name:req.body.name})
        .then((copy)=>{
            if(copy){
                return res.status(500).json({error:'This level exists'})
            }else{
                const newLevel = new Level({
                    name:req.body.name
                })
                newLevel.save()
                .then((level)=>{
                    if(level){
                        res.status(201).json({message:'Level created successfully'})
                    }
                }).catch((err)=>{
                    return res.status(500).json({error:'Something went wrong'})
                })
            }
        }).catch((err)=>{
            res.status(500).json({error:'Something Went Wrong'})
        })
    }
})
module.exports = router