const pool = require("../config/db");
const path = require("path");
const fs = require("fs");


exports.uploadResume = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res
        .status(403)
        .json({ message: "Only candidates can upload resume" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded" });
    }

    const resumePath = req.file.path;

    await pool.query(
      "UPDATE users SET resume_path = $1 WHERE id = $2",
      [resumePath, req.user.id]
    );

    res.json({ message: "Resume uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ message: "Only recruiters can download resumes" });
    }

    const { userId } = req.params;

    const result = await pool.query(
      "SELECT resume_path FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0].resume_path) {
      return res
        .status(404)
        .json({ message: "Resume not found" });
    }

    const resumePath = result.rows[0].resume_path;
    const absolutePath = path.resolve(resumePath);

    if (!fs.existsSync(absolutePath)) {
      return res
        .status(404)
        .json({ message: "File does not exist" });
    }

    res.download(absolutePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
