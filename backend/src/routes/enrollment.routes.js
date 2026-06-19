const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const pool = require("../config/database");
const authenticate = require("../middleware/authenticate");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Single manual entry
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
    res.status(500).json({ message: "Server error." });
  }
});

// CSV bulk upload
router.post("/csv", authenticate, upload.single("csvFile"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const results = [];
    const errors = [];
    let rowNumber = 0;

    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded." });
    }

    const csvData = req.file.buffer.toString("utf-8");
    const rows = csvData.split("\n").filter((row) => row.trim() !== "");

    if (rows.length < 2) {
      return res.status(400).json({ message: "CSV file is empty or has no data rows." });
    }

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      rowNumber = i + 1;
      const columns = rows[i].split(",").map((col) => col.trim());

      if (columns.length < 6) {
        errors.push({ row: rowNumber, message: `Row ${rowNumber}: Missing columns` });
        continue;
      }

      const [learnerName, institutionName, gender, disability, educationLevel, location] = columns;

      if (!learnerName || !institutionName || !gender || !educationLevel || !location) {
        errors.push({ row: rowNumber, message: `Row ${rowNumber}: Missing required fields` });
        continue;
      }

      if (gender !== "Male" && gender !== "Female") {
        errors.push({ row: rowNumber, message: `Row ${rowNumber}: Invalid gender '${gender}'. Use Male or Female` });
        continue;
      }

      results.push([teacherId, learnerName, institutionName, gender, disability === "Yes", educationLevel, location]);
    }

    // Bulk insert valid rows
    let enrolled = 0;
    if (results.length > 0) {
      const query = "INSERT INTO learners (teacher_id, learner_name, institution_name, gender, disability, education_level, location) VALUES ?";
      const [result] = await pool.query(query, [results]);
      enrolled = result.affectedRows;
    }

    res.json({ message: "Upload complete", enrolled, errors });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;