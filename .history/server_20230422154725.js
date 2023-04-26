const express = require('express');
const dotenv = require('dotenv');
const connectToDb = require('./config/mongo');
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const aboutRouter = require('./routes/aboutRoutes');
const skillsRouter = require('./routes/skillsRouter');
const levelsRouter = require('./routes/levelsRouter');
const paymentRouter = require('./routes/paymentsRoute');
const productsRouter = require('./routes/productsRoutes')
const cookieParser = require('cookie-parser')
const path = require('path')
const {dirname} = require('path');
const cors = require('cors')

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const url = process.env.URL
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(cookieParser())
app.options('*', cors());
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, 'Images')))
app.use(`${url}+users`, userRouter);
app.use(`${url}+about`, aboutRouter);
app.use(`${url}+skills`, skillsRouter);
app.use(`${url}+levels`, levelsRouter);
app.use(`${url}+payments`, paymentRouter);
app.use(`${url}+products`, productsRouter);
app.use(`${url}+Images`, express.static(path.join(__dirname, 'Images')))

connectToDb();
app.get(`${url}`,(req,res)=>{
    res.status(200).json({message:'Wooza'})
    
})
app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`)
})