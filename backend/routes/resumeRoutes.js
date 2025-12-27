const express = require('express');
const router = express.Router();
const { uploadResume, downloadResume, getResumePreview } = require('../controllers/resumeController');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../utils/constants');
const upload = require('../config/multer');
const asyncHandler = require('../middleware/asyncHandler');

router.post(
  '/upload',
  authenticate,
  authorizeRoles(ROLES.CANDIDATE),
  upload.single('resume'),
  asyncHandler(uploadResume)
);

router.get(
  '/download/:userId',
  authenticate,
  authorizeRoles(ROLES.RECRUITER, ROLES.ADMIN),
  asyncHandler(downloadResume)
);

router.get(
  '/preview',
  authenticate,
  asyncHandler(getResumePreview)
);

module.exports = router;
