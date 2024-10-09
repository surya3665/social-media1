const UserModel = require("../models/user.model")
const NotificationModel = require("../models/Notification.model")
const bcrypt = require("bcrypt")
const { v2 } = require("cloudinary")

const profileController = async(req, res) => {
try {
const {userName} = req.params
const user = await UserModel.findOne({userName})
if(!user) {
    return res.status(404).json({error: "user not found"})
}
return res.status(200).json(user)
}
catch(err) {
    console.log(err.message)
}
}


const followAndUnfollow = async(req, res) =>{
    try {
        const {id} = req.params
        const currentUser = await UserModel.findById(req.user._id)
        const userToModify = await UserModel.findById(id)
        if(id == req.user._id) {
            return res.status(400).json({
                error: "You can't follow/unfollow yourself",
                success: false
            })
        }
        if(!currentUser || !userToModify) {
            return res.status(400).json({error: "user not found"})
        }
    
   

        const isFollowing = currentUser.following.includes(id)
        const newNotification = new NotificationModel({
            type: "follow",
            from: req.user._id,
            to: userToModify._id
        })
        await newNotification.save()
        if(isFollowing){
            await UserModel.findByIdAndUpdate(id, {
                $pull: {followers: req.user._id}
            })

            await UserModel.findByIdAndUpdate(req.user._id, {
                $pull: {following: id}
            })
            return res.status(200).json({msg: "user unfollowed successfull"})

        }
        else {
            await UserModel.findByIdAndUpdate(id, {
                $push: {followers: req.user._id}
            })
            await UserModel.findByIdAndUpdate(req.user._id, {
                $push: {following: id}
            })
            return res.status(200).json({msg: "user followed successfull"})

        }



    }
    catch(err) {
        console.log(err.message)
    }
}
const suggestUser = async (req,res) => {
    try{
        const userId = req.user._id
        const userFollowedByme = await UserModel.findById(userId).select("following")

        const users = await UserModel.aggregate([
            {
                $match:{
                    _id:{$ne:userId}
                },
            },
            {
                $sample:{size:10}
            }
        ])
        const filterUser = users.filter(user => !userFollowedByme.following.includes(user._id))
        const suggestUser = filterUser.slice(0,5)
        suggestUser.forEach(user => user.password = null)

        return res.status(200).json({msg: suggestUser})
    }
    catch(err){
        res.json({msg:err.message})
    }
}


const updateUser = async(req, res) => {
    try{
        let {fullName, userName, email, currentPassword, newPassword, bio, link} = req.body
       
        let {profileImg, coverImg} = req.body
        const userId = req.user._id
        let user = await UserModel.findById(userId)
        if(!user) {
            return res.status(404).json({error: "User not found"})
        }
        if(!newPassword || !currentPassword){
            return res.status(400).json({error: "please provide both current password and new password"})
        }
        if (currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch){
                return res.status(400).json({error: "current password is incorrect"})
            }

            if(newPassword.length < 6){
                return res.status(400).json({error: "password must be at least 6 characters long"})
            }
            user.password = await bcrypt.hash(newPassword, 8)
        if(profileImg) {
            if(user.profileImg) {
                await v2.uploader.destroy(
                    user.profileImg.split("/").split(".")[0]
                )
            }
            const uploadUrl = await v2.uploader.upload(profileImg)
            profileImg = uploadUrl.secure_url
        }
       
      
            if(coverImg) {
                if(user.coverImg) {
                    await v2.uploader.destroy(
                        user.coverImg.split("/").split(".")[0]
                    )
                }
                const uploadUrl2 = await v2.uploader.upload(coverImg)
                coverImg = uploadUrl2.secure_url
            }

   

            user.fullName = fullName || user.fullName
            user.userName = userName || user.userName
            user.email = email || user.email
            user.bio = bio || user.bio
            user.link = link || user.link
            user.profileImg = profileImg || user.profileImg
            user.coverImg = coverImg || user.coverImg

            await user.save()
            user.password = null
            return res.json({msg: "working", user})


        }

    
    }
    catch(err){
return res.json(err.message)
    }
}

module.exports = {
    profileController,
    followAndUnfollow,
    suggestUser,
    updateUser
}