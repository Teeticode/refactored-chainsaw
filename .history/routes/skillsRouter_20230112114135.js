const express = require('express');
const verifyUser = require('../middlewares/jwtVerify');
const Skill = require('../models/Skills');
const router = express.Router();

router.get('/', (req,res)=>{
    return res.status(200).json({message:"end point working"})
})

router.post('/', verifyUser,(req,res)=>{
    if(!req.body.title){
        return res.status(500).json({error:'Add a Title please'})
    }
    const newSkill = new Skill({
        title:req.body.title,
        skills:req.body.skills
    })
    newSkill.save()
    .then((skill)=>{
        if(skill){
            return res.status(201).json({message:'Skill created 👍'})
        }
    }).catch((err)=>{
        return res.status(500).json({error:'Something went wrong'})
    })
})


module.exports = router;