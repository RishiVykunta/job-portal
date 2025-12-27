const pool = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');
const fs = require('fs');

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'You cannot delete your own account',
      },
    });
  }

  const userResult = await pool.query('SELECT resume_path FROM users WHERE id = $1', [id]);
  const resumePath = userResult.rows[0]?.resume_path;

  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'User not found',
      },
    });
  }

  if (resumePath && fs.existsSync(resumePath)) {
    try {
      fs.unlinkSync(resumePath);
    } catch (err) {
      console.error('Error deleting resume file:', err);
    }
  }

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

const getAllJobs = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT j.*, u.name as recruiter_name, u.email as recruiter_email 
     FROM jobs j 
     JOIN users u ON j.recruiter_id = u.id 
     ORDER BY j.created_at DESC`
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Job not found',
      },
    });
  }

  res.json({
    success: true,
    message: 'Job deleted successfully',
  });
});

const getAllApplications = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT 
      a.*, 
      j.title as job_title, 
      j.company as job_company,
      u.name as candidate_name, 
      u.email as candidate_email 
     FROM applications a 
     JOIN jobs j ON a.job_id = j.id 
     JOIN users u ON a.candidate_id = u.id 
     ORDER BY a.applied_at DESC`
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const usersCount = await pool.query('SELECT COUNT(*) as count, role FROM users GROUP BY role');
  const jobsCount = await pool.query('SELECT COUNT(*) as count FROM jobs');
  const applicationsCount = await pool.query('SELECT COUNT(*) as count FROM applications');

  const recentJobs = await pool.query(
    'SELECT * FROM jobs ORDER BY created_at DESC LIMIT 5'
  );
  const recentApplications = await pool.query(
    `SELECT a.*, j.title as job_title, u.name as candidate_name 
     FROM applications a 
     JOIN jobs j ON a.job_id = j.id 
     JOIN users u ON a.candidate_id = u.id 
     ORDER BY a.applied_at DESC LIMIT 5`
  );

  const jobsByCompany = await pool.query(
    'SELECT company, COUNT(*) as count FROM jobs GROUP BY company ORDER BY count DESC LIMIT 10'
  );

  const roleCounts = {
    candidate: 0,
    recruiter: 0,
    admin: 0,
  };
  usersCount.rows.forEach((row) => {
    roleCounts[row.role] = parseInt(row.count);
  });

  res.json({
    success: true,
    data: {
      counts: {
        users: roleCounts,
        totalUsers: roleCounts.candidate + roleCounts.recruiter + roleCounts.admin,
        jobs: parseInt(jobsCount.rows[0].count),
        applications: parseInt(applicationsCount.rows[0].count),
      },
      recentJobs: recentJobs.rows,
      recentApplications: recentApplications.rows,
      jobsByCompany: jobsByCompany.rows,
    },
  });
});

module.exports = {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
  getAnalytics,
};
