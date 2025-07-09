const express = require("express");
const multer = require("multer");
const uploadController = require("./upload.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store file in memory for cloudinary

router.post("/", upload.single("image"), uploadController.uploadImage);

module.exports = router;
