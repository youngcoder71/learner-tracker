const express = require("express");
const pool = require("../config/database");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.json({ locations: [] });
    }

    const [rows] = await pool.query(
      "SELECT name FROM locations WHERE name LIKE ? LIMIT 15",
      [`${search}%`]
    );

    res.json({ locations: rows.map((r) => r.name) });
  } catch (error) {
    console.error("Location search error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;