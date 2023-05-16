const express = require('express');
const Category = require('../models/Category.js');
const verifyUser = require('../middlewares/jwtVerify.js');
const upload = require("../middlewares/multerHelper.js");
const dotenv = require('dotenv')
dotenv.config()
const api = process.env.api_image
const categoryRouter = express.Router();

categoryRouter.get('/', (req,res)=>{
    Category.find({})
    .then((cat)=>{
        res.status(200).json({category:cat})
    })
    .catch((err)=>{
        res.status(500).json({
            error:'not found',
            success:false
        })
    })
})
categoryRouter.get('/:id', (req,res)=>{
    Category.findById(req.params.id)
    .then((cat)=>{
        res.status(200).json(cat)
    })
    .catch((err)=>{
        res.status(500).json({
            error:'not found',
            success:false
        })
    })
})

categoryRouter.post('/',verifyUser,upload, (req,res)=>{
    if(!req.body.name || !req.file.filename){
        return res.status(500).json({error:'Fill in all fields.'})
    }
    if(req.file.mimetype ==='image/jpg' || req.file.mimetype ==='image/jpeg' || req.file.mimetype ==='image/png'){
        const category = new Category({
            name:req.body.name,
            color:req.body.color,
            icon:req.body.icon,
            image:api+req.file.filename,
            owner:req.user
        });

        category.save()
        .then((newCat)=>{
            res.status(201).json({category:newCat})
        })
        .catch((err)=>{
            res.status(500).json({
                error:'try again',
                success:false
            })
        })
    }else{
        return res.status(401).json({error:'Invalid Image Type'})
    }
})

categoryRouter.delete("/:id", verifyUser, (req,res)=>{
    Category.findByIdAndDelete(req.params.id)
    .then((deletedCat)=>{
        if(deletedCat){
           return res.status(200).json({
            success:true,
            message:'Category was deleted successfully'
           })
        }else{
            return res.status(404).json({
                success:false,
                message:'category not found'
            })
        }
        
    })
    .catch(err=>{
        return res.status(500).json({
            error:'try again',
            success:false
        })
    })
})
categoryRouter.put('/:id', verifyUser,upload, (req,res)=>{
    if(!req.body.name || !req.file.filename){
        return res.status(500).json({error:'Fill in all fields.'})
    }
    if(req.file.mimetype ==='image/jpg' || req.file.mimetype ==='image/jpeg' || req.file.mimetype ==='image/png'){
        Category.findById(req.params.id)
        .then((cat)=>{
            if(cat.owner === req.user){
                Category.findByIdAndUpdate(
                    req.params.id,
                    {
                        name:req.body.name,
                        image:api+req.file.filename,
                        owner:req.user
                    },
                    {
                        new:true
                    }  
                )
                .then((updatedCat)=>{
                    if(updatedCat){
                        return res.status(200).json(updatedCat)
                    }else{
                        return res.status(404).json({
                            success:false,
                            message:"Category not found"
                        })
                    }
                })
                .catch((err)=>{
                    return res.status(500).json({
                        error:'try again',
                        success:false
                    })
                })
            }else{
                return res.status(404).json({error:'This Is Not Your Category'})
            }
        }).catch((err)=>{
            return res.status(500).json({error:'Something Went Wrong'})
        })
        
    }else{
        return res.status(401).json({error:'Invalid Image Type'})
    }
})


module.exports = categoryRouter