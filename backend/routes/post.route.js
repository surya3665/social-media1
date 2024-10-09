const router = require("express").Router()
const {createPost, commentPost, deletePost, likeAndDislike, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts} = require("../controllers/post.controller")
const { protectRoute } = require("../middleware/protectRoute")
router.post("/createPost",protectRoute,createPost)
router.post("/commentPost/:id",protectRoute,commentPost)
router.delete("/delete/:id",protectRoute,deletePost)
router.post("/likeDislike/:id",protectRoute,likeAndDislike)
router.get("/getAllPosts",protectRoute,getAllPosts)
router.get("/getLikedPost/:id",protectRoute,getLikedPosts)
router.get("/getFollowingPost",protectRoute,getFollowingPosts)
router.get("/getUserPosts/:userName",protectRoute,getUserPosts)

module.exports= router