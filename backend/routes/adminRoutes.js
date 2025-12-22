const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
  getAllUsers,
  getAllJobs,
  getAllApplications,
  deleteUser,
  deleteJob
} = require("../controllers/adminController");


router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  getAllUsers
);


router.get(
  "/jobs",
  authMiddleware,
  authorizeRoles("admin"),
  getAllJobs
);


router.get(
  "/applications",
  authMiddleware,
  authorizeRoles("admin"),
  getAllApplications
);


router.delete(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteUser
);


router.delete(
  "/jobs/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteJob
);

module.exports = router;
