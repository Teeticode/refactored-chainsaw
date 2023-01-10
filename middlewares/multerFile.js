const multer = require('multer')
const path = require('path')
const fs = require('fs')
const {fileURLToPath} = require('url')


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(fs.existsSync('Files')){
            cb(null, 'Files')
        }else{
            fs.mkdirSync('Files')
            cb(null, 'Files')
        }
    },
    filename:(req,file,cb)=>{
        const savedfile = Date.now()+(file.originalname).split(' ').join('')
        cb(null, savedfile)
    }
})



const uploadFile = multer({storage:storage}).single('cv');


module.exports = uploadFile;