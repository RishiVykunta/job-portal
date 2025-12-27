const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');
const { validateRegister, validateLogin } = require('../utils/validation');
const { JWT_EXPIRES_IN } = require('../utils/constants');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const errors = validateRegister(name, email, password, role);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors,
      },
    });
  }

  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'User with this email already exists',
      },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name.trim(), email.toLowerCase().trim(), hashedPassword, role]
  );

  const user = result.rows[0];

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.status(201).json({
    success: true,
    data: {
      token,
      user,
    },
    message: 'User registered successfully',
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const errors = validateLogin(email, password);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors,
      },
    });
  }

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [
    email.toLowerCase().trim(),
  ]);

  if (result.rows.length === 0) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid email or password',
      },
    });
  }

  const user = result.rows[0];

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid email or password',
      },
    });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    message: 'Login successful',
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, role, resume_path, created_at FROM users WHERE id = $1',
    [req.user.id]
  );

  res.json({
    success: true,
    data: result.rows[0],
  });
});

module.exports = {
  register,
  login,
  getProfile,
};
