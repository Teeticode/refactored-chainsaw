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

router.post('/',verifyUser, (req,res)=>{
    if(req.role !== 'admin'){
        return res.status(401).json({error:'Invalid Request'})
    }else{
        if(!req.body.name || !req.body.amount){
            return res.status(500).json({error:'Fill In All Fields'})
        }
        const tier = new Tiers({
            name:req.body.name,
            amount:req.body.amount
        })
        tier.save()
        .then((savedTier)=>{
            return res.status(201).json({success:`${savedTier.name} created successfully`})
        })
        .catch((err)=>{
            return res.status(500).json({error:'Something Went Wrong'});
        })
    }
    
})
router.delete('/:id',verifyUser, (req,res)=>{
    const id = req.params.id;
    if(mongoose.isValidObjectId(id)){
        if(req.role === 'admin'){
            Tiers.findByIdAndDelete(id)
            .then((deletedTier)=>{
                if(deletedTier){
                    return res.status(200).json({success:true});
                }else{
                    return res.status(200).json({success:false});
                }
            })
            .catch((err)=>{
                return res.status(500).json({error:'Something Went Wrong'})
            })
        }else{
            return res.status(401).json({error:'Invalid Request'})
        }
    }else{
        return res.status(500).json({error:'Something Went Wrong'})
    }
})

module.exports = router;