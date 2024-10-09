const mongoose = require("mongoose")

const NotificationSchema = new  mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required: true
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["follow", "like"]
    },
    read: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const NotificationModel = mongoose.model("notificationModels", NotificationSchema)
module.exports = NotificationModel