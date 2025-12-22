const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected at:", result.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/resume", resumeRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));



app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("Job Portal Backend Running");
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});


app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
