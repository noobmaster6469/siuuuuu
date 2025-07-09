const express = require("express");
const router = express.Router();
const likeController = require("./like.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.patch("/:id", verifyToken, likeController.toggleLike);
router.get("/status/:blogId", verifyToken, likeController.getLikeStatus);
router.get('/all-public', likeController.getAllLikes); // no token required

module.exports = router;
