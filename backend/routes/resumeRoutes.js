const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadResume,
  downloadResume,
} = require("../controllers/resumeController");


router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/download/:userId",
  authMiddleware,
  downloadResume
);

module.exports = router;
