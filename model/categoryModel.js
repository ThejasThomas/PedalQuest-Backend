const mongoose =require('mongoose')

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    images: [{  // Changed from image to images to match usage
        type: String,
        required: true
    }],
    description:{
        type:String,
        required:true
    },
    cloudinaryId: {  // Add this if not already present
        type: String
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

module.exports =mongoose.model('Category',categorySchema);