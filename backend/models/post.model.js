const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    text:String,
    img:String,
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users"
        },
    ],
    comments: [
        {
            text:{
                type:String,
                required:true
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Users",
                required:true
            }
        }
    ]
},{timestamps:true})

const postModel = mongoose.model("posts",postSchema)

module.exports=postModel