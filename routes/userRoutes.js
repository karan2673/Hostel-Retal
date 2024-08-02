const express = require("express");
const router = express.Router();

const {
  signupController,
  loginController,
} = require("../controllers/userCtrl");
// routes

// REGISTER || POST
router.post("/signup", signupController);

// LOGIN || POST
router.post("/login", loginController);

// Add Fomdata ID || POST
module.exports = router;
