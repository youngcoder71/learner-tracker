const express = require("express");
const pool = require("../config/database");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

// Get dashboard data
router.get("/", authenticate, async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Summary cards
    const [totalLearners] = await pool.query(
      "SELECT COUNT(*) AS count FROM learners WHERE teacher_id = ?",
      [teacherId]
    );

    const [femaleLearners] = await pool.query(
      "SELECT COUNT(*) AS count FROM learners WHERE teacher_id = ? AND gender = 'Female'",
      [teacherId]
    );

    const [maleLearners] = await pool.query(
      "SELECT COUNT(*) AS count FROM learners WHERE teacher_id = ? AND gender = 'Male'",
      [teacherId]
    );

    const [disabledLearners] = await pool.query(
      "SELECT COUNT(*) AS count FROM learners WHERE teacher_id = ? AND disability = TRUE",
      [teacherId]
    );

    const [institutions] = await pool.query(
      "SELECT COUNT(DISTINCT institution_name) AS count FROM learners WHERE teacher_id = ?",
      [teacherId]
    );

    // Line graph data - learners by education level
    const [lineGraph] = await pool.query(
      "SELECT education_level AS level, COUNT(*) AS count FROM learners WHERE teacher_id = ? GROUP BY education_level ORDER BY FIELD(education_level, 'Early Education', 'Primary', 'Secondary', 'Tertiary', 'Professional')",
      [teacherId]
    );

    res.json({
      cards: {
        totalLearners: totalLearners[0].count,
        femaleLearners: femaleLearners[0].count,
        maleLearners: maleLearners[0].count,
        disabledLearners: disabledLearners[0].count,
        totalInstitutions: institutions[0].count,
      },
      barGraph: {
        female: femaleLearners[0].count,
        male: maleLearners[0].count,
      },
      lineGraph: lineGraph,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;