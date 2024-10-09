const UserModel = require("../models/user.model")
const NotificationModel = require("../models/Notification.model")
const postModel = require("../models/post.model")

const createPost = async(req,res) => {
    try{
        const {text} = req.body
        let{img} = req.body
        const userId = req.user._id
        const user = await UserModel.find(userId)
        if(!user) {
            return res.status(400).json({err:"post must have text or image"})
        }
        if(img){
            const uploadedResponse = await v2.uploader.upload(img)
            img = uploadedResponse.secure.url
        }

        const newPost = new postModel({
            user:userId,
            text,
            img,
        })
        await newPost.save()
        return res.status(201).json(newPost)
    }catch(err){
        return res.json(err.message)
    }
}
const commentPost = async (req,res) =>{
    try{
        const {text} = req.body
        const postId = req.params.id
        const userId = req.user._id

        if(!text) {
            return res.status(400).json({msg:"text field is required"})
        }
        const post = await postModel.findById(postId)
        console.log(post)
        if(!post){
            return res.status(404).json({error:"post not found"})
        }
        const comment = {user:userId,text}
        post.comments.push(comment)
        await post.save()
        res.status(200).json(post)
    }
    catch{
        return res.json(err.message)
    }
}
const deletePost = async (req,res) => {
    try{
        const post = await postModel.findById(req.params.id)
        if(!post){
            return res.status(404).json({error:"post not found"})
        }
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(404).json({error:"you are not delete"}) 
        }
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0]
            await v2.uploader.destroy(imgId)
        }
        await postModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({msg:"post delete successfully"})
    }catch{
        return res.json(err.message)
    }
}
const likeAndDislike = async(req,res) => {
    try{
        const userId = req.user._id
        const {id} = req.params
        const post = await postModel.findById(id)

        if(!post){
            return res.status(404).json({error:"post not found"}) 
        }
        const userLikePost = post.likes.includes(userId)

        if(userLikePost){
            await postModel.updateOne({_id:id},{$pull:{likes:userId}})
            await UserModel.updateOne(
                {_id:userId},
                {$pull:{likedPosts:id}}
            )
            return res.status(200).json({msg:"post dislike successfully"})
        }
        else{
            post.likes.push(userId)
            await post.save()
            const Notification = await NotificationModel({
                from:userId,
                to:post.user,
                type:"like"
            })
            await Notification.save()
            await UserModel.updateOne(
                {_id:userId},
                {$push:{likedPosts:id}}
            )
            return res.status(200).json({msg:"post like successfully"})
        }
    }catch(err){
        console.log(err.message)
    }
}
 const getAllPosts = async (req,res) => {
    try{
        const posts = await postModel.find()
        .sort({createAt:-1})
        .populate({
            path:"user",
            select:"-password",
        })
        .populate({
            path:"comments.user",
            select:"-password",
        })
        if (posts.length==0){
            return res.status(200).json([])
        }
        return res.status(200).json(posts)
    }catch(err){
        console.log(err.message)
        return res.status(500).json({msg:"internal server err"})
    }
 }
 const getLikedPosts = async (req,res) => {
       try{
        const userId = req.params.id
        const user = await UserModel.findById(userId)
        console.log(user)
        if(!user) return res.status(404).json({err:"user not found"})
        const likedPosts = await postModel.find({_id:{$in : user.likedPosts}})
        .populate({path:"user",select:"-password"})
        .populate({path:"comments.user",select:"-password"})
        return res.status(200).json({msg:"user all liked posts",likedPosts})
       }catch(err){
        return res.status(500).json({msg:"internal server err"})
       } 
 }
 const getFollowingPosts = async (req,res) => {
    try{
        const userId = req.user._id
        const user = await UserModel.findById(userId)
        if(!user) return res.status(404).json({err:"user not found"})
        const following = user.following
        const feedPosts = await postModel.find({user:{$in:following}})
        .sort({
            createAt:-1
        })
        .populate({path:"user",select:"-password"})
        .populate({path:"comments.user",select:"-password"})

        return res.status(200).json({feedPosts})
    }catch(err){
        console.log(err.message);
    return res.status(500).json({ error: "Internal server error" })
    }
 }
 const getUserPosts = async(req,res) => {
    try{
        const { userName } = req.params
        const user = await UserModel.findOne({userName})
        if (!user) return res.status(404).json({err:"user not found"})
        const posts = await postModel.find({user:user._id})
        .sort({createAt:-1})
        .populate({path:"user",select:"-password"})
        .populate({path:"comments.user",select:"-password"})
        return res.status(200).json(posts)
    }catch(err){
        console.log(err.message);
    return res.status(500).json({ error: "Internal server error" })
    }
 }

module.exports = {
    createPost,commentPost,deletePost,likeAndDislike,getAllPosts,getLikedPosts,getFollowingPosts,getUserPosts
}