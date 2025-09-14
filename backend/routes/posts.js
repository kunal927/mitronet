const express = require("express")
const router = express.Router()
const {isAuthenticated} = require("../middleware/auth")
const {asyncHandler} = require("../middleware/errorHandler")
const {
  getCreatePost,
  createPost,
  getPostShow,
  createPostFromShow,
  toggleLike,
  addComment,
  deletePost,
  deleteComment,
} = require("../controllers/postController")

// @route   GET /createpost
// @desc    Get create post page
// @access  Private
router.get("/createpost", isAuthenticated, asyncHandler(getCreatePost))

// @route   POST /createpost
// @desc    Create new post
// @access  Private
router.post("/createpost", isAuthenticated, asyncHandler(createPost))

// @route   GET /postshow
// @desc    Get all posts for display
// @access  Private
router.get("/postshow", isAuthenticated, asyncHandler(getPostShow))

// @route   POST /postshow
// @desc    Create post from postshow page
// @access  Private
router.post("/postshow", isAuthenticated, asyncHandler(createPostFromShow))

// @route   POST /like/:postId
// @desc    Like/Unlike a post
// @access  Private
router.post("/like/:postId", isAuthenticated, asyncHandler(toggleLike))

// @route   POST /comment/:postId
// @desc    Add comment to post
// @access  Private
router.post("/comment/:postId", isAuthenticated, asyncHandler(addComment))

// @route   DELETE /deletepost/:postId
// @desc    Delete a post
// @access  Private
router.delete("/deletepost/:postId", isAuthenticated, asyncHandler(deletePost))

// @route   DELETE /deletecomment/:postId/:commentId
// @desc    Delete a comment
// @access  Private
router.delete(
  "/deletecomment/:postId/:commentId",
  isAuthenticated,
  asyncHandler(deleteComment)
)

module.exports = router
