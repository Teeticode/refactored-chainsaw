const dotenv = require('dotenv')
const express = require('express')
const router = express.Router()
dotenv.config()

const Mpesa = require('mpesa-api').Mpesa
const credentials = {
    clientKey: process.env.consumer_key,
    clientSecret: process.env.consumer_secret,
    initiatorPassword: 'Safaricom999!*!',

}

const environment = "sandbox"
const mpesa = new Mpesa(credentials,environment)
router.post('/',(req,res)=>{
    
    mpesa
    .c2bregister({
        ShortCode: 174379,
        ConfirmationURL: "https://localhost:3000",
        ValidationURL: "https://localhost:3000",
        ResponseType: "Response Type",
    })
    .then((response) => {
        //Do something with the response
        //eg
        console.log(response);
    })
    .catch((error) => {
        //Do something with the error;
        //eg
        console.error(error);
    });
    mpesa
    .c2bsimulate({
        ShortCode: 123456,
        Amount: 1000 /* 1000 is an example amount */,
        Msisdn: req.body.number,
       /*  CommandID: "Command ID" /* OPTIONAL ,
        BillRefNumber: "Bill Reference Number" OPTIONAL */
    })
    .then((response) => {
        //Do something with the response
        //eg
        console.log(response);
    })
    .catch((error) => {
        //Do something with the error;
        //eg
        console.error(error);
    });
})

module.exports = router