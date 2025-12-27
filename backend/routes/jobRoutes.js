const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  getRecruiterJobs,
  applyToJob,
  getJobApplications,
  getAppliedJobs,
} = require('../controllers/jobController');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../utils/constants');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/', authenticate, asyncHandler(getJobs));
router.get('/:id', authenticate, asyncHandler(getJobById));

router.get('/applied/list', authenticate, authorizeRoles(ROLES.CANDIDATE), asyncHandler(getAppliedJobs));
router.post('/:id/apply', authenticate, authorizeRoles(ROLES.CANDIDATE), asyncHandler(applyToJob));

router.post('/', authenticate, authorizeRoles(ROLES.RECRUITER), asyncHandler(createJob));
router.get('/recruiter/my-jobs', authenticate, authorizeRoles(ROLES.RECRUITER), asyncHandler(getRecruiterJobs));
router.get('/:id/applications', authenticate, authorizeRoles(ROLES.RECRUITER), asyncHandler(getJobApplications));

module.exports = router;
