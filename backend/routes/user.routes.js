const { protectRoute } = require("../middleware/protectRoute")
const {profileController, followAndUnfollow,suggestUser, updateUser} = require("../controllers/user.controller")
const router = require("express").Router()

router.get("/profile/:userName", protectRoute, profileController)
router.post("/suggested", protectRoute, suggestUser);
router.post("/follow/:id", protectRoute, followAndUnfollow);
router.put("/update", protectRoute, updateUser);

module.exports = router