const express=require('express')
const mongoose=require('mongoose')
const bodyParser = require('body-parser');
const dotenv=require('dotenv')
const cors=require('cors')
const path=require('path')
const cookieParser=require('cookie-parser')
const app=express()
const userRoute=require('./routes/userRoute')
const adminRoute=require('./routes/adminRoute')

app.use(cookieParser())
dotenv.config();
app.use(express.json())
const corsOPtions={
    origin:'http://localhost:5173',
    credentials:true,
}
app.use(cors(corsOPtions))
app.use(express.json())
app.use(bodyParser.json({ limit: '50mb' })); // Set JSON payload limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


mongoose.connect("mongodb://127.0.0.1:27017/PedalQuest")
  .then(()=>{
    console.log(`mongoDB connected succesfully to ${mongoose.connection.name}`);
  })
  .catch(err=>{
    console.error('MongoDB connection error:',err);     
  })
  app.use('/user',userRoute)
  app.use('/admin',adminRoute)

  app.listen('3000',()=>{
    console.log('server started')
  })