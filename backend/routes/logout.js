const express = require("express")
const router = express.Router()
const {logout} = require("../controllers/authController")

// @route   POST /logout
// @desc    Logout user
// @access  Private
router.post("/", logout)

module.exports = router
