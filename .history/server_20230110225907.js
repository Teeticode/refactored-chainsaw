const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectToDb = require('./config/mongo');
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const aboutRouter = require('./routes/aboutRoutes');
const skillsRouter = require('./routes/skillsRouter');
const path = require('path')
const {dirname} = require('path');
const cors = require('cors')

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const url = process.env.URL
app.use(express.json());
app.use(express.urlencoded())
app.use(cors());
app.options('*', cors());
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, 'Images')))
app.use(`users`, userRouter);
app.use(`about`, aboutRouter);
app.use(`skills`, skillsRouter);
app.use(`Images`, express.static(path.join(__dirname, 'Images')))

connectToDb();
app.get(``,(req,res)=>{
    res.status(200).json({message:'Wooza'})
    
})
app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`)
})
