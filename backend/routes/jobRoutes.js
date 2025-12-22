const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createJob,
  getAllJobs,
  applyToJob,
  getApplications,
} = require("../controllers/jobController");


router.post(
  "/",
  authMiddleware,
  authorizeRoles("recruiter"),
  createJob
);


router.get(
  "/",
  authMiddleware,
  getAllJobs
);

router.post(
  "/:id/apply",
  authMiddleware,
  authorizeRoles("candidate"),
  applyToJob
);


router.get(
  "/applications",
  authMiddleware,
  authorizeRoles("recruiter"),
  getApplications
);

module.exports = router;
