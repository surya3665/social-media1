const UserModel = require("../models/user.model")

const jwt = require("jsonwebtoken")

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if(!token) {
            return res.status(401).json({error: "unauthorized", success: false})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_KEY)
        if(!decodedToken) {
            return res.status(404).json({error: "authorized", success: false})
        }
        const user = await UserModel.findOne({_id: decodedToken.userId})
        if(!user){
            return res.status(404).json({error: "user not found"})
        }
        req.user = user
        next()
    }
    catch(err) {
        console.log(err.message)
        return res.status(500).json({error: "internal server error"})
    }
}

module.exports = {
    protectRoute
}