const multer = require('multer')
const path = require('path')
const fs = require('fs')
const {fileURLToPath} = require('url')


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(fs.existsSync('Images')){
            cb(null, 'Images')
        }else{
            fs.mkdirSync('Images')
            cb(null, 'Images')
        }
    },
    filename:(req,file,cb)=>{
        const savedfile = Date.now()+(file.originalname).split(' ').join('')
        cb(null, savedfile)
    }
})



const upload = multer({storage:storage}).single('image');


module.exports = upload;