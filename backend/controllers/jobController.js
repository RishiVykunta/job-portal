const pool = require("../config/db");


exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    if (!title || !company) {
      return res.status(400).json({ message: "Title and company are required" });
    }

    const recruiterId = req.user.id;

    await pool.query(
      `INSERT INTO jobs (title, company, location, description, recruiter_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [title, company, location, description, recruiterId]
    );

    res.status(201).json({ message: "Job posted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT jobs.id, title, company, location, description, created_at
       FROM jobs
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const candidateId = req.user.id;

   
    if (req.user.role !== "candidate") {
      return res
        .status(403)
        .json({ message: "Only candidates can apply for jobs" });
    }

    const alreadyApplied = await pool.query(
      "SELECT id FROM applications WHERE job_id = $1 AND candidate_id = $2",
      [jobId, candidateId]
    );

    if (alreadyApplied.rows.length > 0) {
      return res.status(409).json({ message: "Already applied to this job" });
    }

    
    await pool.query(
      "INSERT INTO applications (job_id, candidate_id) VALUES ($1, $2)",
      [jobId, candidateId]
    );

    res.status(201).json({ message: "Job applied successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ message: "Only recruiters can view applications" });
    }

    const result = await pool.query(`
      SELECT 
        applications.id AS application_id,
        users.id AS user_id,
        users.email,
        jobs.title,
        jobs.company
      FROM applications
     JOIN users ON applications.candidate_id = users.id

      JOIN jobs ON applications.job_id = jobs.id
      ORDER BY applications.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
