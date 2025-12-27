const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/profile', authenticate, asyncHandler(getProfile));

module.exports = router;
