const express = require('express');
const User = require('../models/Users');
const About = require('../models/About');
const verifyUser = require('../middlewares/jwtVerify');
const upload = require('../middlewares/multerHelper');
const uploadFile = require('../middlewares/multerFile');
const router = express.Router();

router.get('/',verifyUser, (req,res)=>{
    if(req.admin){
        About.find({}).populate('info','email')
        .then((abouts)=>{
            return res.status(200).json({abouts})
        }).catch(err=>{
            return res.status(500).json({error:'something went wrong'})
        })
    }else{
        return res.status(401).json({error:'Not Authorized'})
    }
})
router.get('/:id', (req,res)=>{
    About.findOne({info:req.params.id})
    .then((about)=>{
        User.findOne({userid: req.params.id})
        .then((user)=>{
            if(user){
                if(about){
                    return res.status(200).json({about})
                }else{
                    return res.status(404).json({error:'About not found'})
                }
            }else{
                return res.status(500).json({error:'User Doesnt Exist'})
            }
        }).catch((err)=>{
            return res.status(500).json({error:'Something Went Wrong'})
        })
    }).catch(err=>{
        return res.status(500).json({error:'something went wrong'})
    })
})

router.post('/',upload,verifyUser,(req,res)=>{
    if(!req.user|| !req.body.about || 
        !req.file.filename 
        || !req.body.profession ){
        return res.status(500).json({error:'Fill in required Fields'})
    }
    console.log(req.userid)
    const professions = new Array()
    professions.push(req.body.profession)
    About.findOne({info:req.userid})
    .then((aboutuser)=>{
        if(aboutuser){
            return res.status(500).json({error:'You already have An about'})
        }else{
            User.findOne({userid:req.userid}).select('email firstname lastname userid -_id isAdmin isVerified')
            .then((user)=>{
                if(user){
                    const newAbout = new About({
                        info:req.userid,
                        about:req.body.about,
                        image:`https://refactored-chainsaw-teeti.onrender.com/api/v1/Images/`+req.file.filename,
                        profession:req.body.profession,
                        projects:req.body.projects,
                        experience:req.body.experience,
                        user:user
                    })
                    newAbout.save()
                    .then((about)=>{
                        if(about){
                            return res.status(201).json({message:"About Created successfully"})
                        }
                    }).catch((err)=>{
                        return res.status(500).json({error:err.message})
                    })
                }else{
                    return res.status(404).json({error:'Portfolio Not Found'})
                }
            }).catch((err)=>{
                return res.status(500).json({error:'Something Went Wrong'})
            })
            
        }
    }).catch((err)=>{
        return res.status(500).json({error:"Something Went Wrong"})
    })
    
})

router.put('/info/:id', upload, verifyUser,(req,res)=>{
    if(!req.user|| !req.body.about 
        || !req.body.profession ){
            console.log(req.body)
        return res.status(500).json({error:'Fill in required Fields'})
    }
    if(req.body.profession===''){
        return res.status(500).json({error:'Cant be empty'})
    }
    
    
    let image = '';
    if(req.file){
       image = `http://localhost:5050/api/v1/Images/`+req?.file?.filename
    }else{
       image = req.body.image
    }
    About.findOne({info:req.userid})
    .then((aboutUser)=>{
        if(aboutUser){
            if(aboutUser._id == req.params.id){
                About.findByIdAndUpdate(
                    req.params.id,
                    {
                        about:req.body.about,
                        profession:req.body.profession,
                        experience:req.body.experience,
                        projects:req.body.projects,
                        image:image,
                    },
                    {new:true}
                )
                .then((about)=>{
                    if(about){
                        return res.status(201).json({about:about,message:'Update was successfull'})
                    }else{
                        return res.status(404).json({error:'About was not found'})
                    }
                })
                .catch((err)=>{
                    console.log(err)
                    return res.status(500).json({error:'Something went wrong'})
                })
            }else{
                return res.status(401).json({error:'Unauthorised Action'})
            }
        }else{
            return res.status(401).json({error:'Not Authorised'})
        }
    }).catch((err)=>{
        return res.status(500).json({error:'Something Went Wrong'})
    })
    
})

module.exports = router