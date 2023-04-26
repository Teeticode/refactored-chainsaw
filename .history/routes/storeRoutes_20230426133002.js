const express = require('express');
const mongoose = require('mongoose');
const verifyUser = require('../middlewares/jwtVerify.js');
const Business = require('../models/Business.js');
const Product = require('../models/Product.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const upload = require('../middlewares/multerHelper.js');

dotenv.config()
const businessRouter = express.Router();
const api = process.env.api_image
businessRouter.get('/',(req,res)=>{
    Business.find({}).sort({'createdAt':-1})
    .then(businesses=>{
        if(businesses){
            return res.status(200).json({businesses:businesses})
        }else{
            return res.status(404).json({error:"not found"})
        }
    })
    .catch(err=>{
        return res.status(500).json({error:"something went wrong"})
    })
})

businessRouter.get('/:id',verifyUser,(req,res)=>{
    Business.findById(req.params.id).populate("products")
    .then(business=>{
        console.log(business)
        if(business){
            return res.status(200).json({business:business})
        }else{
            return res.status(404).json({error:"not found"})
        }
    })
    .catch(err=>{
        return res.status(500).json({error:"something went wrong"})
    })
})
businessRouter.get('/owner/:id',verifyUser, (req,res)=>{
    Business.findOne({owner:req.params.id}).populate("products")
    .then((store)=>{
        return res.status(200).json({store:store})
    }).catch(err=>{
        return res.status(500).json({error:"Something went wrong"})
    })
})

businessRouter.post('/',verifyUser,upload,(req,res)=>{
    if(!req.body.name||!req.body.description||!req.body.category){
        return res.status(500).json({error:"Fill all fields"})
    }
    console.log(req)
    Business.findOne({name:req.body.name})
    .then((businessname)=>{
        if(businessname){
            return res.status(500).json({error:"business name is taken"})
        }else{
            Product.find({owner:req.user})
            .then((products)=>{
                if(products){
                    const business = new Business({
                        name:req.body.name,
                        owner:req.user,
                        description:req.body.description,
                        products:products,
                        image:api+req.body.image,
                        category:req.body.category
                    })
                    business.save()
                    .then((business)=>{
                        return res.status(201).json({message:"store created successfully"})
                    }).catch((err)=>{
                        return res.status(500).json({error:"something went wrong"})
                    })
                }else{
                    const business = new Business({
                        name:req.body.name,
                        owner:req.user,
                        description:req.body.description
                    })
                    business.save()
                    .then((business)=>{
                        return res.status(201).json({message:"store created successfully"})
                    }).catch((err)=>{
                        return res.status(500).json({error:"something went wrong"})
                    })
                }
    })
    .catch((err)=>{
        return res.status(500).json({error:err})
    })
        }
    })
    .catch((err)=>{
        return res.status(500).json({error:"something went wrong"})
    })
    
    
})
businessRouter.post('/signin',verifyUser,(req,res)=>{
    Business.findOne({name:req.body.name})
    .then((biz)=>{
        if(biz){
            if(biz.owner === req.user){
                const token = jwt.sign(
                    {
                        bizId:biz._id, 
                        name:biz.name,
                        userId:req.user
                    },
                    process.env.TOKEN_SECRET_BIZ,
                    {expiresIn:'3w'}
                )
                return res.status(200).json({token:token})
            }else{
                return res.status(403).json({errro:"Invalid"})
            }
        }else{
            return res.status(404).json({error:"Business not found"})
        }
    }).catch(err=>{
        return res.status(500).json({error:"something went wrong"})
    })
})

businessRouter.put("/:id",verifyUser,(req,res)=>{
    Business.findById(req.params.id)
    .then((biz)=>{
        if(biz){
            console.log(req.biz)
            if(biz.owner === req.user){
                Business.findOne({name:req.body.name})
                .then((bizname)=>{
                    if(bizname){
                        return res.status(500).json({error:"Name is already taken"})
                    }else{
                        Business.findByIdAndUpdate(
                            biz._id,
                            {
                                name:req.body.name,
                                description:req.body.description
                            },
                            {new:true}
                        ).then(updateBiz=>{
                            return res.status(200).json({updatedBiz:updateBiz})
                        }).catch(err=>{
                            return res.status(500).json({error:"could not update your store"})
                        })
                    }
                }).catch(err=>{
                    return res.status(500).json({error:"something went wrong"})
                })
            }else{
                return res.status(403).json({error:"This store is not yours"})
            }
        }else{
            return res.status(404).json({error:"business not found"})
        }
    }).catch(err=>{
        return res.status(500).json({error:"something went wrong"})
    })
})

module.exports = businessRouter