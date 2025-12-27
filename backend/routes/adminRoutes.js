const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
  getAnalytics,
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../utils/constants');
const asyncHandler = require('../middleware/asyncHandler');

router.use(authenticate);
router.use(authorizeRoles(ROLES.ADMIN));

router.get('/users', asyncHandler(getAllUsers));
router.delete('/users/:id', asyncHandler(deleteUser));
router.get('/jobs', asyncHandler(getAllJobs));
router.delete('/jobs/:id', asyncHandler(deleteJob));
router.get('/applications', asyncHandler(getAllApplications));
router.get('/analytics', asyncHandler(getAnalytics));

module.exports = router;
