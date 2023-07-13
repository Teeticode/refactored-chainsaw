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
router.get('/:id', (req,res)=>{
    const id = req.params.id;
    Tiers.findOne({_id:id})
    .then((tier)=>{
        if(!tier){
            return res.status(404).json({error:'Tier not found'})
        }else{
            return res.status(200).json({tier:tier})
        }
    })
    .catch((err)=>{
        return res.status(500).json({error:'Something Went Wrong'})
    })
})

router.post('/',verifyUser, (req,res)=>{
    console.log(req.admin);
    if(req.admin !== 'admin'){
        return res.status(401).json({error:'Invalid Request'})
    }else{
        if(!req.body.name || !req.body.amount){
            return res.status(500).json({error:'Fill In All Fields'})
        }
        Tiers.findOne({name:req.body.name})
        .then((existsTier)=>{
            if(!existsTier){
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
            }else{
                return res.status(500).json({error:'Tier Exists'})
            }
        })
        .catch((err)=>{
            return res.status(500).json({error:'Something Went Wrong'})
        })
    }
    
})
router.delete('/:id',verifyUser, (req,res)=>{
    const id = req.params.id;
    console.log(req.admin)
    if(mongoose.isValidObjectId(id)){
        if(req.admin !== 'admin'){
            return res.status(401).json({error:'Invalid Request'})
        }else{
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
        }
    }else{
        return res.status(500).json({error:'Something Went Wrong'})
    }
})

module.exports = router;