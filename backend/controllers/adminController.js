const pool = require("../config/db");


const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM jobs ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getAllApplications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        applications.id AS application_id,
        users.email AS candidate_email,
        jobs.title,
        jobs.company,
        applications.status,
        applications.applied_at
      FROM applications
      JOIN users ON applications.candidate_id = users.id
      JOIN jobs ON applications.job_id = jobs.id
      ORDER BY applications.applied_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM jobs WHERE id = $1", [id]);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  getAllJobs,
  getAllApplications,
  deleteUser,
  deleteJob,
};
