const pool = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');
const { validateJob } = require('../utils/validation');
const { JOBS_PER_PAGE } = require('../utils/constants');
const { sendJobApplicationEmail } = require('../services/emailService');

const getJobs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || JOBS_PER_PAGE;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  let query = `SELECT j.*, u.name as recruiter_name, COUNT(a.id) as applicant_count 
               FROM jobs j 
               JOIN users u ON j.recruiter_id = u.id 
               LEFT JOIN applications a ON j.id = a.job_id`;
  const queryParams = [];
  let paramIndex = 1;

  if (search) {
    query += ` WHERE (j.title ILIKE $${paramIndex} OR j.company ILIKE $${paramIndex} OR j.location ILIKE $${paramIndex})`;
    queryParams.push(`%${search}%`);
    paramIndex++;
    query += ` GROUP BY j.id, u.name ORDER BY j.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  } else {
    query += ` GROUP BY j.id, u.name ORDER BY j.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  }
  
  queryParams.push(limit, offset);

  const jobsResult = await pool.query(query, queryParams);

  const jobs = jobsResult.rows.map((job) => ({
    ...job,
    applicant_count: parseInt(job.applicant_count) || 0,
  }));

  let countQuery = 'SELECT COUNT(*) FROM jobs j';
  if (search) {
    countQuery += ` WHERE (j.title ILIKE $1 OR j.company ILIKE $1 OR j.location ILIKE $1)`;
  }
  const countResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
  const total = parseInt(countResult.rows[0].count);

  res.json({
    success: true,
    data: {
      jobs: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT j.*, u.name as recruiter_name, u.email as recruiter_email, COUNT(a.id) as applicant_count 
     FROM jobs j 
     JOIN users u ON j.recruiter_id = u.id 
     LEFT JOIN applications a ON j.id = a.job_id 
     WHERE j.id = $1 
     GROUP BY j.id, u.name, u.email`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Job not found',
      },
    });
  }

  const job = {
    ...result.rows[0],
    applicant_count: parseInt(result.rows[0].applicant_count) || 0,
  };

  res.json({
    success: true,
    data: job,
  });
});

const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, description, salary, skills_required } = req.body;

  const errors = validateJob(title, company, location, description, salary, skills_required);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors,
      },
    });
  }

  const result = await pool.query(
    'INSERT INTO jobs (title, company, location, description, salary, skills_required, recruiter_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [
      title.trim(),
      company.trim(),
      location.trim(),
      description.trim(),
      salary ? salary.trim() : null,
      skills_required ? skills_required.trim() : null,
      req.user.id,
    ]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Job created successfully',
  });
});

const getRecruiterJobs = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT j.*, COUNT(a.id) as applicant_count 
     FROM jobs j 
     LEFT JOIN applications a ON j.id = a.job_id 
     WHERE j.recruiter_id = $1 
     GROUP BY j.id 
     ORDER BY j.created_at DESC`,
    [req.user.id]
  );

  const jobs = result.rows.map((job) => ({
    ...job,
    applicant_count: parseInt(job.applicant_count) || 0,
  }));

  res.json({
    success: true,
    data: jobs,
  });
});

const applyToJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const candidateId = req.user.id;

  const jobResult = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
  if (jobResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Job not found',
      },
    });
  }

  const userResult = await pool.query('SELECT resume_path FROM users WHERE id = $1', [candidateId]);
  if (!userResult.rows[0].resume_path) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Please upload your resume before applying',
      },
    });
  }

  const existingApplication = await pool.query(
    'SELECT id FROM applications WHERE job_id = $1 AND candidate_id = $2',
    [id, candidateId]
  );

  if (existingApplication.rows.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'You have already applied to this job',
      },
    });
  }

  await pool.query('INSERT INTO applications (job_id, candidate_id) VALUES ($1, $2)', [
    id,
    candidateId,
  ]);

  try {
    const candidate = await pool.query('SELECT name, email FROM users WHERE id = $1', [candidateId]);
    const job = jobResult.rows[0];
    await sendJobApplicationEmail(candidate.rows[0], job);
  } catch (emailError) {
    console.error('Failed to send email notification:', emailError);
  }

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
  });
});

const getJobApplications = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const jobResult = await pool.query('SELECT recruiter_id FROM jobs WHERE id = $1', [id]);
  if (jobResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Job not found',
      },
    });
  }

  if (jobResult.rows[0].recruiter_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Access denied',
      },
    });
  }

  const result = await pool.query(
    `SELECT a.*, u.name as candidate_name, u.email as candidate_email, u.resume_path 
     FROM applications a 
     JOIN users u ON a.candidate_id = u.id 
     WHERE a.job_id = $1 
     ORDER BY a.applied_at DESC`,
    [id]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

const getAppliedJobs = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT j.*, a.applied_at 
     FROM applications a 
     JOIN jobs j ON a.job_id = j.id 
     WHERE a.candidate_id = $1 
     ORDER BY a.applied_at DESC`,
    [req.user.id]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

const deleteRecruiterJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const jobResult = await pool.query('SELECT recruiter_id FROM jobs WHERE id = $1', [id]);
  if (jobResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Job not found',
      },
    });
  }

  if (jobResult.rows[0].recruiter_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: {
        message: 'You can only delete your own jobs',
      },
    });
  }

  await pool.query('DELETE FROM jobs WHERE id = $1', [id]);

  res.json({
    success: true,
    message: 'Job deleted successfully',
  });
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  getRecruiterJobs,
  applyToJob,
  getJobApplications,
  getAppliedJobs,
  deleteRecruiterJob,
};
