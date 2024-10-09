const {
    getNotificationController,
    deleteAllNotificationController,
    deleteNotificationController
  } = require("../controllers/notification.controller");
  const { protectRoute } = require("../middleware/protectRoute");
  
  const router = require("express").Router();
  router.get("/", protectRoute, getNotificationController);
  router.delete("/", protectRoute, deleteAllNotificationController);
  router.delete("/:id", protectRoute, deleteNotificationController);
  
  module.exports = router;