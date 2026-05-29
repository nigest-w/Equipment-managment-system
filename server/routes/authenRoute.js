const express = require("express");
const router = express.Router();

const {
  register,
  login
} = require("../controller/authcontroller");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// protected test route
router.get("/verify", authMiddleware, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user
  });
});


module.exports = router;