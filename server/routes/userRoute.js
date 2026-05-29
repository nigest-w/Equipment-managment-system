const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL EMPLOYEES
router.get("/employees", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE role = 'employee'"
    );

    res.json(result.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;