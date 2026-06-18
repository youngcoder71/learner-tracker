const express = require("express");
const pool = require("../config/database");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

// Enroll a learner
router.post("/", authenticate, async (req, res) => {
  try {
    const { learnerName, institutionName, gender, disability, educationLevel, location } = req.body;
    const teacherId = req.user.id;

    if (!learnerName || !institutionName || !gender || !educationLevel || !location) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await pool.query(
      "INSERT INTO learners (teacher_id, learner_name, institution_name, gender, disability, education_level, location) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [teacherId, learnerName, institutionName, gender, disability, educationLevel, location]
    );

    res.status(201).json({ message: "Learner enrolled successfully." });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;