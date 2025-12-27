const pool = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');
const path = require('path');
const fs = require('fs');

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No file uploaded',
      },
    });
  }

  const resumePath = req.file.path;

  await pool.query('UPDATE users SET resume_path = $1 WHERE id = $2', [
    resumePath,
    req.user.id,
  ]);

  res.json({
    success: true,
    data: {
      resume_path: resumePath,
    },
    message: 'Resume uploaded successfully',
  });
});

const downloadResume = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const result = await pool.query('SELECT resume_path, name FROM users WHERE id = $1', [userId]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'User not found',
      },
    });
  }

  const resumePath = result.rows[0].resume_path;
  const userName = result.rows[0].name;

  if (!resumePath || !fs.existsSync(resumePath)) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Resume not found',
      },
    });
  }

  res.download(resumePath, `${userName}_resume.pdf`, (err) => {
    if (err) {
      console.error('Error downloading resume:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: {
            message: 'Error downloading resume',
          },
        });
      }
    }
  });
});

const getResumePreview = asyncHandler(async (req, res) => {
  const userId = req.user.role === 'admin' ? req.query.userId : req.user.id;

  const result = await pool.query('SELECT resume_path FROM users WHERE id = $1', [userId]);

  if (result.rows.length === 0 || !result.rows[0].resume_path) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Resume not found',
      },
    });
  }

  const resumePath = result.rows[0].resume_path;

  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Resume file not found',
      },
    });
  }

  res.json({
    success: true,
    data: {
      resume_path: resumePath,
    },
  });
});

module.exports = {
  uploadResume,
  downloadResume,
  getResumePreview,
};
