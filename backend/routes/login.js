const express = require("express")
const router = express.Router()
const {
  validateLogin,
  handleValidationErrors,
} = require("../middleware/validation")
const {asyncHandler} = require("../middleware/errorHandler")
const {getLogin, login} = require("../controllers/authController")

// @route   GET /login
// @desc    Get login page
// @access  Public
router.get("/", getLogin)

// @route   POST /login
// @desc    Authenticate user
// @access  Public
router.post("/", validateLogin, handleValidationErrors, asyncHandler(login))

module.exports = router
