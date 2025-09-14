const UserProfile = require("../models/profiledata")
const Post = require("../models/post")

// @desc    Get create post page
// @route   GET /createpost
// @access  Private
const getCreatePost = async (req, res) => {
  try {
    const user = req.session.user
    const profile = await UserProfile.findOne({userId: user._id})

    return res.json({
      success: true,
      user,
      profile: profile || {},
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Create new post
// @route   POST /createpost
// @access  Private
const createPost = async (req, res) => {
  try {
    const user = req.session.user
    const {content} = req.body

    const newPost = new Post({
      userId: user._id,
      content,
    })

    await newPost.save()

    return res.json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Get all posts for display
// @route   GET /postshow
// @access  Private
const getPostShow = async (req, res) => {
  try {
    const user = req.session.user

    // Fetch user profile
    const profile = await UserProfile.findOne({userId: user._id})

    // Fetch all posts and populate user info
    const allPosts = await Post.find({}).sort({createdAt: -1}).populate("userId")

    // For each post, fetch profile image
    const postsWithUser = await Promise.all(
      allPosts.map(async (post) => {
        const userProfile = await UserProfile.findOne({
          userId: post.userId._id,
        })
        return {
          _id: post._id,
          FullName: post.userId.FullName,
          profileImg: userProfile?.profileImage || null,
          content: post.content,
          likes: post.likes || [],
          comments: post.comments || [],
          userId: post.userId._id,
        }
      })
    )

    return res.json({
      success: true,
      posts: postsWithUser,
      user,
      profile: profile || {},
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Create post from postshow page
// @route   POST /postshow
// @access  Private
const createPostFromShow = async (req, res) => {
  try {
    const user = req.session.user
    const {content} = req.body
    
    const newPost = new Post({
      userId: user._id,
      content,
    })
    await newPost.save()

    return res.json({success: true, message: "Post created successfully!"})
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Something went wrong!"})
  }
}

// @desc    Like/Unlike a post
// @route   POST /like/:postId
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const userId = req.session.user._id
    const postId = req.params.postId

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({success: false, error: "Post not found"})
    }

    if (!post.likes) {
      post.likes = []
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    )

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      )
    } else {
      // Like
      post.likes.push(userId)
    }

    await post.save()

    return res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Add comment to post
// @route   POST /comment/:postId
// @access  Private
const addComment = async (req, res) => {
  try {
    const userId = req.session.user._id
    const userName = req.session.user.FullName
    const postId = req.params.postId
    const {comment} = req.body

    if (!comment || comment.trim() === "") {
      return res.status(400).json({success: false, error: "Comment cannot be empty"})
    }

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({success: false, error: "Post not found"})
    }

    if (!post.comments) post.comments = []

    const newComment = {
      userId,
      userName,
      text: comment,
      date: new Date(),
    }

    post.comments.push(newComment)
    await post.save()

    return res.json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Delete a post
// @route   DELETE /deletepost/:postId
// @access  Private
const deletePost = async (req, res) => {
  try {
    const userId = req.session.user._id
    const postId = req.params.postId

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({success: false, error: "Post not found"})
    }

    // Check if the user owns the post
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({success: false, error: "Not authorized to delete this post"})
    }

    await Post.findByIdAndDelete(postId)

    return res.json({success: true, message: "Post deleted successfully"})
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Delete a comment
// @route   DELETE /deletecomment/:postId/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const userId = req.session.user._id
    const {postId, commentId} = req.params

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({success: false, error: "Post not found"})
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    )

    if (commentIndex === -1) {
      return res.status(404).json({success: false, error: "Comment not found"})
    }

    // Check if the user owns the comment
    if (post.comments[commentIndex].userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this comment",
      })
    }

    post.comments.splice(commentIndex, 1)
    await post.save()

    return res.json({success: true, message: "Comment deleted successfully"})
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

module.exports = {
  getCreatePost,
  createPost,
  getPostShow,
  createPostFromShow,
  toggleLike,
  addComment,
  deletePost,
  deleteComment,
}