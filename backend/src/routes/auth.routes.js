const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../config/database");
const generatePassword = require("../utils/passwordGenerator");
const { sendPasswordEmail } = require("../services/email.service");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, schoolName, position, email } = req.body;

    if (!fullName || !schoolName || !position || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const [existing] = await pool.query("SELECT id FROM people WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const password = generatePassword();
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO people (full_name, school_name, position, email, password_hash) VALUES (?, ?, ?, ?, ?)",
      [fullName, schoolName, position, email, passwordHash]
    );

    // Send email in background - don't block
    sendPasswordEmail(email, password)
      .then(() => console.log("Email sent"))
      .catch((err) => console.error("Email failed:", err.message));

    res.status(201).json({
      message: "Registration successful.",
      password: password,
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const [people] = await pool.query("SELECT * FROM people WHERE email = ?", [email]);
    if (people.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const person = people[0];
    const isMatch = await bcrypt.compare(password, person.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: person.id, email: person.email, position: person.position },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful.",
      token: token,
      user: {
        id: person.id,
        fullName: person.full_name,
        schoolName: person.school_name,
        position: person.position,
        email: person.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    res.json({ message: "If the email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;