const express = require('express');
const User = require('../models/Users');
const About = require('../models/About');
const verifyUser = require('../middlewares/jwtVerify');
const upload = require('../middlewares/multerHelper');
const uploadFile = require('../middlewares/multerFile');
const router = express.Router();

router.get('/', (req,res)=>{
   
        About.find({}).limit(4)
        .then((abouts)=>{
            return res.status(200).json({abouts:abouts})
        }).catch(err=>{
            return res.status(500).json({error:'something went wrong'})
        })
    
})
router.get('/:id', (req,res)=>{
    About.findOne({info:req.params.id})
    .then((about)=>{
        
        if(about){
            User.findOne({userid: req.params.id})
            .then((user)=>{
                if(user){
                    return res.status(200).json({about})
                }else{
                    return res.status(404).json({error:'About not found'})
                }
            }).catch((err)=>{
                return res.status(500).json({error:'Something Went Wrong'})
            })
            
        }else{
            return res.status(500).json({error:'About Doesnt Exist'})
        }
        
    }).catch(err=>{
        return res.status(500).json({error:'something went wrong'})
    })
})

router.post('/',verifyUser,(req,res)=>{
    if(!req.user|| !req.body.about 
        || !req.body.profession ){
        return res.status(500).json({error:'Fill in required Fields'})
    }
    
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
                        image:req.body.image,
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

router.put('/info/:id', verifyUser,(req,res)=>{
    if(!req.user|| !req.body.about 
        || !req.body.profession ){
            console.log(req.body)
        return res.status(500).json({error:'Fill in required Fields'})
    }
    if(req.body.profession===''){
        return res.status(500).json({error:'Cant be empty'})
    }
    
    
    
    /*
    let image = ''
    if(req.file){
       image = `https://refactored-chainsaw-teeti.onrender.com/api/v1/Images/`+req?.file?.filename
    }else{
       image = req.body.image
    }*/
    let image = req.body.image
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
                        image:req.body.image,
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