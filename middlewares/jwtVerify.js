const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function verifyUser (req,res,next){
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        const id = decodedToken.id
        const userid = decodedToken.userid
        const isAdmin = decodedToken.isAdmin
        if(req.body.id&& req.body.userid && req.body.isAdmin && req.body.userid !== userid && req.body.isAdmin!==isAdmin  && req.body.userId !== id){
            res.status(401).json({
                error: 'something went wrong'
            })
        }else{
            req.user = id;
            req.admin = isAdmin;
            req.userid = userid;
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: 'something went wrong'
        })
    }
}

module.exports = verifyUser