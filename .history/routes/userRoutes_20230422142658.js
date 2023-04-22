const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verifyUser = require('../middlewares/jwtVerify')
const Phone = require('../models/Phone')
const otpGenerator = require('otp-generator')
const _ = require('lodash')
const axios = require('axios');
const { lowerCase } = require('lodash');
const Premium = require('../models/PremiumSubscriber');
const asyncHandler = require('express-async-handler')
dotenv.config();


router.get('/',(req,res)=>{
    
    User.find({}).select('userid firstname lastname email verified createdAt')
    .then((users)=>{
        if(users){
            return res.status(200).json({users:users})
        }else{
            return res.status(404).json({error:'Not found'})
        }
    })
    .catch(err=>{
        return res.status(500).json({error:'something went wrong'})
    })
})

router.get('/:id',(req,res)=>{
    User.findOne({userid:req.params.id}).select('firstname lastname email userid verified isBlocked createdAt')
    .then((users)=>{
        console.log(req.admin)

        if(users){
            return res.status(200).json({user:users})
        }else{
            return res.status(404).json({error:'Not found'})
        }
    })
    .catch(err=>{
        return res.status(500).json({error:'something went wrong'})
    })
})
router.get('/block/:id',(req,res)=>{
    const paramid = req.params.id
    if(mongoose.isValidObjectId(paramid)){
        User.findByIdAndUpdate({_id:req.params.id})
        .then((users)=>{
            console.log(req.admin)

            if(users){
                return res.status(200).json({user:users})
            }else{
                return res.status(404).json({error:'Not found'})
            }
        })
        .catch(err=>{
            return res.status(500).json({error:'something went wrong'})
        })
    }else{
        return res.status(500).json({error:'Something Went wrong'})
    }
    
})

router.post('/register',(req,res)=>{
    if(!req.body.firstname|| !req.body.lastname || !req.body.password || !req.body.username || !req.body.confirm || !req.body.email){
        return res.status(500).json({error:'Fill in all fields'})
    }
    const userid = lowerCase(req.body.firstname)+ '-' + lowerCase(req.body.lastname) + '-' + (Math.floor(Math.random() * 2000000 + 20))
    console.log(userid)
    if(req.body.password !== req.body.confirm){
        return res.status(500).json({error:'Passwords Do Not Match'})
        console.log(userid)
    }
   
    
    User.findOne({email:req.body.email.toLowerCase()})
    .then((emailuser)=>{
        if(!emailuser){
            User.findOne({username:req.body.username.toLowerCase()})
            .then((username)=>{
                if(!username){
                    User.findOne({userid:userid})
                    .then((userExists)=>{
                        if(!userExists){
                            bcrypt.hash(req.body.password,10)
                            .then((hashedPsd)=>{
                                const newUser = new User({
                                    firstname:req.body.firstname,
                                    lastname:req.body.lastname,
                                    password:hashedPsd,
                                    userid:userid,
                                    email:req.body.email.toLowerCase(),
                                    username:req.body.username.toLowerCase()
                                })
                                newUser.save()
                                .then((user)=>{
                                    if(user){
                                        return res.status(201).json({message:'Account Created Successfully, Refresh To Create A new Account'})
                                    }
                                }).catch((err)=>{
                                    return res.status(500).json({error:'user not created. Try Again Later!'})
                                })
                            }).catch(err=>{
                                return res.status(500).json({error:'something went wrong'})
                            })
                        }else{
                            return res.status(500).json({error:'Please Try Again'})
                        }
            }).catch((err)=>{
                return res.status(500).json({error:'Something Went Wrong'})
            })
                }else{
                    return res.status(200).json({error:'Username is taken'})
                }
            })
            
        }else{
            return res.status(401).json({error:'Email is taken'})
        }
    }).catch((err)=>{
        return res.status(500).json({error:'Something went wrong'})
    })
    
})

router.post('/login',(req,res)=>{
    if(!req.body.email || !req.body.password){
        return res.status(500).json({error:'Fill in all fields'})
    }
    const admin = process.env.ADMIN
    User.findOne({email:req.body.email.toLowerCase()})
    .then((logUser)=>{
        
        if(logUser){
            
            bcrypt.compare(req.body.password, logUser.password)
            .then((verifiedUser)=>{
                if(verifiedUser){
                    const token = jwt.sign(
                        {
                            id:logUser._id,
                            userid:logUser.userid,
                            role:logUser.role,
                            premium:true
                        },
                        process.env.TOKEN_SECRET,
                        {expiresIn:'1440h'}
                    )
                    if(logUser.email === admin){
                        User.findByIdAndUpdate(logUser._id,{
                            token:token,
                            role:'admin'
                        },{
                            new:true
                        }).then((updatedUser)=>{
                            return res.status(200).json({user:updatedUser})
                        }).catch(error=>{
                            console.log(error)
                        })
                        
                    }else{
                        User.findByIdAndUpdate(logUser._id,{
                            token:token
                        },{
                            new:true
                        }).then((updatedUser)=>{
                            return res.status(200).json({user:updatedUser})
                        }).catch(error=>{
                            console.log(error)
                        })
                        
                    }
                    
                    
                    
                }else{
                    return res.status(401).json({error:'credential error'})
                }
            }).catch((err)=>{
                return res.status(500).json({error:'Something went wrong'})
            })
        }else{
            return res.status(404).json({error:'Credential Error'})
        }
    }).catch(err=>{
        return res.status(500).json({error:'something went wrong'})
    })
})

router.post('/verify/phone', verifyUser, (req,res)=>{
    User.findOne({userid:req.userid})
    .then((user)=>{
        if(user){
            const number = req.body.number
           const OTP = otpGenerator.generate(4,{
                digits:true,alphabets:false,upperCaseAlphabets:false,specialChars:false
            })
            const otp = new Phone({number:number, otp:OTP})
            otp.otp = bacrypt.hash(otp)
        }else{
            return res.status(404).json({error:'Not Authorized'})
        }
    }).catch((err)=>{
        res.status(500).json({error:'Something Went Wrong'})
    })
})

module.exports = router;