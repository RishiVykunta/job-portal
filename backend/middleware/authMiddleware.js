const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No token provided',
        },
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [
        decoded.id,
      ]);

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'User not found',
          },
        });
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid or expired token',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate };
