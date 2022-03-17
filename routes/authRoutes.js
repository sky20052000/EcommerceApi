const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// Register
router.post("/register", authController.userRegister);

// Login
router.post("/login", authController.userLogin);

module.exports = router;