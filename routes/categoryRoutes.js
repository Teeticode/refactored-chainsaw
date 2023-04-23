const express = require('express');
const Category = require('../models/Category.js');
const verifyUser = require('../middlewares/jwtVerify.js');

const categoryRouter = express.Router();

categoryRouter.get('/', (req,res)=>{
    Category.find({})
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

categoryRouter.post('/', (req,res)=>{
    const category = new Category({
        name:req.body.name,
        color:req.body.color,
        icon:req.body.icon,
        image:req.body.image
    });
    category.save()
    .then((newCat)=>{
        res.status(201).json(newCat)
    })
    .catch((err)=>{
        res.status(500).json({
            error:'try again',
            success:false
        })
    })
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
categoryRouter.put('/:id', verifyUser, (req,res)=>{
    Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color,
            image:req.body.image
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
})


module.exports = categoryRouter