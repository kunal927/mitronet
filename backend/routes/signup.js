const express = require("express")
const router = express.Router()
const {
  validateSignup,
  validateLogin,
  handleValidationErrors,
} = require("../middleware/validation")
const {asyncHandler} = require("../middleware/errorHandler")
const {
  getSignup,
  signup,
  getLogin,
  login,
  logout,
} = require("../controllers/authController")

// @route   GET /signup
// @desc    Get signup page
// @access  Public
router.get("/", getSignup)

// @route   POST /signup
// @desc    Register new user
// @access  Public
router.post("/", validateSignup, handleValidationErrors, asyncHandler(signup))

module.exports = router
