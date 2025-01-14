const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,

    },
    isAdmin:{
        type:Boolean,
        default:0,
    },
    isBlocked:
     { type: Boolean, 
       default: false
    },
    createdAt:{
       type: Date,
       default: Date.now
    }
})
const User =mongoose.model('userss',userSchema)
module.exports =User