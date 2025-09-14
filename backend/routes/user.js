const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const {isAuthenticated, isAdmin} = require("../middleware/auth")
const {asyncHandler} = require("../middleware/errorHandler")
const {
  getProfile,
  getEditProfile,
  updateProfile,
  getDashboard,
  getLoginSuccessful,
  getHome,
  addFriend,
  removeFriend,
  getConnections,
  getAbout,
} = require("../controllers/userController")

// Multer configuration for file uploads
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({storage, fileFilter})

// @route   GET /home
// @desc    Get home page
// @access  Public
router.get("/home", getHome)

// @route   GET /profile
// @desc    Get user profile
// @access  Private
router.get("/profile", isAuthenticated, asyncHandler(getProfile))

// @route   GET /editprofile
// @desc    Get edit profile page
// @access  Private
router.get("/editprofile", isAuthenticated, asyncHandler(getEditProfile))

// @route   POST /editprofile
// @desc    Update user profile
// @access  Private
router.post(
  "/editprofile",
  isAuthenticated,
  upload.single("profileImage"),
  asyncHandler(updateProfile)
)

// @route   GET /dashboard
// @desc    Get dashboard (admin only)
// @access  Private (Admin)
router.get("/dashboard", isAuthenticated, isAdmin, asyncHandler(getDashboard))

// @route   GET /loginSuccessful
// @desc    Get login successful page with feed
// @access  Private
router.get(
  "/loginSuccessful",
  isAuthenticated,
  asyncHandler(getLoginSuccessful)
)

// @route   POST /addfriend
// @desc    Add friend
// @access  Private
router.post("/addfriend", isAuthenticated, asyncHandler(addFriend))

// @route   POST /removefriend
// @desc    Remove friend
// @access  Private
router.post("/removefriend", isAuthenticated, asyncHandler(removeFriend))

// @route   GET /connection
// @desc    Get connections page
// @access  Private
router.get("/connection", isAuthenticated, asyncHandler(getConnections))

// @route   GET /about
// @desc    Get about page
// @access  Public
router.get("/about", getAbout)

module.exports = router