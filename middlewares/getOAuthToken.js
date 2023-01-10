const dotenv = require('dotenv')
dotenv.config()

async function getOAuthToken(req,res,next){
    let consumer_key = process.env.consumer_key;
    let consumer_secret = process.env.consumer_secret
    let url = process.env.auth_url
    let buffer = new Buffer.from(consumer_key+":"+consumer_secret);
    let auth = `Basic ${buffer.toString('base64')}`;
    try{

        let {data} = await axios.get(url,{
            "headers":{
                "Authorization":auth
            }
        });

        req.token = data['access_token'];

        return next();

    }catch(err){

        return res.send({
            success:false,
            message:err['response']['statusText']
        });

    }
}
module.exports = getOAuthToken