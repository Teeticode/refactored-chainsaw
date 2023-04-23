const express = require('express');
const Product = require("../models/Product.js");
const Category = require("../models/Category.js");
const mongoose = require("mongoose");
const verifyUser = require("../middlewares/jwtVerify.js");
const Business = require("../models/Business.js");
const upload = require("../middlewares/multerHelper.js");
const dotenv = require('dotenv')
dotenv.config()
const productRoute = express.Router();
const api = process.env.api_image
productRoute.get("/",(req,res)=>{
        Product.find({}).sort({'createdAt':-1})
        .then((products)=>{
            if(products){
                return res.status(200).json(products)
            }
            
        })
        .catch((err)=>{
            return res.status(500).json({
                error:'not found',
                success:false
            })
        })
      
    }
)

productRoute.get('/:id',(req,res)=>{
    if(mongoose.isValidObjectId(req.params.id)){
        Product.findById(req.params.id)
        .then((product=>{
            res.status(200).json(product)
        }))
        .catch((err)=>{
            res.status(404).json({
                error:'not found',
                success:false
            })
        })
    }else{
        return res.status(500).json({
            error:'The id is invalid'
        })
    }
        
        
    }
)

productRoute.post('/',verifyUser,upload,(req,res)=>{
    if(!req.body.name || !req.body.description || !req.body.price || !req.file.filename || !req.body.countInStock || !req.body.isDiscount || !req.body.category){
        return res.status(404).json({
            error:'fill in all fields please',
            success:false
        })
    }
    if(req.file.mimetype ==='image/jpg' || req.file.mimetype ==='image/jpeg' || req.file.mimetype ==='image/png'){
        Category.findById(req.body.category).select('name color -_id')
        .then((cat)=>{
            console.log(req.user)
            if(cat){
                
                const category = cat
                const product = new Product({
                    name:req.body.name,
                    description:req.body.description,
                    price:req.body.price,
                    image:api+req.file.filename,
                    countInStock: req.body.countInStock,
                    isDiscount:req.body.isDiscount,
                    isFeatured:req.body.isFeatured,
                    category:category,
                    owner:req.user
                })
                
                product.save()
                .then((createdProd)=>{
                    Business.findOne({owner:req.user})
                    .then((business)=>{
                        if(business){
                            Business.findByIdAndUpdate(
                                business._id,
                                {
                                    products:createdProd
                                },
                                {new:true}
                            ).then((businessupdate)=>{
                                return res.status(201).json({message:'product is created'})
                            }).catch(err=>{
                                return res.status(500).json({error:"something went wrong"})
                            })
                        }else{
                            return res.status(500).json({error:"No store is linked"})
                        }
                    }).catch(err=>{
                        return res.status(500).json({error:"something went wrong"})
                    })
                
                })
                .catch((err)=>{
                    return res.status(500).json({
                        error:'product couldnt be created. try again',
                        success:false
                    })
                })
            }else{
                return res.status(404).json({
                    error:'Invalid category',
                    success:'false'
                })
            }
        })
        .catch((err)=>{
            res.status(500).json({
                error:"something went wrong",
                success:false
            })
        })
    }else{
        return res.status(500).json({error:'please upload an image file'})
    }
    
    
    
    
})


productRoute.put('/:id',verifyUser, (req,res)=>{
    if(mongoose.isValidObjectId(req.params.id)){
        if(req.body.category){
            Category.findById(req.body.category)
            .then((cat)=>{
                if(cat){
                    const category = cat;
                    Product.findByIdAndUpdate(
                        req.params.id,
                        {
                            name:req.body.name,
                            description:req.body.description,
                            price:req.body.price,
                            image:req.body.image,
                            countInStock: req.body.countInStock,
                            isDiscount:req.body.isDiscount,
                            isFeatured:req.body.isFeatured,
                            category:category
                        },
                        {new:true}
                    )
                    .then((updatedProd)=>{
                        return res.status(200).json(updatedProd)
                    })
                    .catch((err)=>{
                        return res.status(500).json({
                            error:'product could not update',
                            success:false
                        })
                    })
                }else{
                    return res.status(404).json({
                        error:'Invalid Category',
                        success:false
                    })
                }
            })
            .catch((err)=>{
                return res.status(500).json({
                    error:'something went wrong',
                    success:false
                })
            })
            
        }else{
            Product.findByIdAndUpdate(
                req.params.id,
                {
                    name:req.body.name,
                    description:req.body.description,
                    price:req.body.price,
                    image:req.body.image,
                    countInStock: req.body.countInStock,
                    isDiscount:req.body.isDiscount,
                },
                {new:true}
            ) 
            .then((updatedProd)=>{
                return res.status(200).json(updatedProd)
            })
            .catch((err)=>{
                return res.status(500).json({
                    error:'product could not update',
                    success:false
                })
            })
        }
    }else{
        return res.status(500).json({
            error:'The id is invalid'
        })
    }
})

productRoute.delete('/:id',verifyUser,(req,res)=>{
    if(mongoose.isValidObjectId(req.params.id)){
        Product.findByIdAndDelete(req.params.id)
        .then((deletedProd)=>{
            if(deletedProd){
                return res.status(200).json({
                    success:true,
                    message:"product deleted successfully"
                })
            }else{
                return res.status(404).json({
                    success:false,
                    message:'product not found'
                })
            }
        })
        .catch((err)=>{
            return res.status(500).json({
                error:'try again'
            })
        })
    }else{
        return res.status(500).json({
            error:'The id is invalid'
        })
    }
})
//to fix later on
/*
productRoute.post('/reviews/:id',(req,res)=>{
    Product.findById(req.params.id)
    
    .then((prod)=>{
        prod.reviews.push({
            rating:req.body.rating,
            comments:req.body.comments,
            user:req.body.user
        })
           
                
           
            return res.status(200).json(prod.reviews)
    })
    .catch((err)=>{
        return res.status(500).json({
            error:'could not post review'
        })
    })
})*/
productRoute.get('/all/stats',(req,res)=>{
    Product.countDocuments()
    .then((count)=>{
        res.status(200).json({
            "prodcount":count
        })
    })
    .catch((err)=>{
        return res.status(500).json({
            error:'something went wrong'
        })
    })
});
productRoute.get('/all/featured/:count',(req,res)=>{
    const count = req.params.count ? req.params.count : 0
    Product.find({isFeatured: true}).limit(+count)
    .then((products)=>{
        if(products){
            res.status(200).json(products)
        }else{
            res.status(404).json({
                error:'no products are featured'
            })
        }
    })
    .catch((err)=>{
        return res.status(500).json({
            error:'something went wrong'
        })
    })
})
export default productRoute;