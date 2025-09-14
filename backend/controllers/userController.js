const Signup = require("../models/signup")
const Post = require("../models/post")
const UserProfile = require("../models/profiledata")

// @desc    Get user profile
// @route   GET /profile
// @access  Private
const getProfile = async (req, res) => {
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

// @desc    Get edit profile page
// @route   GET /editprofile
// @access  Private
const getEditProfile = async (req, res) => {
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

// @desc    Update user profile
// @route   POST /editprofile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = req.session.user
    const {headline, education, location, city, dob, contact} = req.body

    let profileData = {
      userId: user._id,
      headline,
      education,
      location,
      city,
      dob,
      contact,
    }

    // Handle profile image upload if present
    if (req.file) {
      profileData.profileImage = req.file.filename
    }

    // Update or create profile
    const profile = await UserProfile.findOneAndUpdate(
      {userId: user._id},
      profileData,
      {new: true, upsert: true}
    )

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Get dashboard (admin only)
// @route   GET /dashboard
// @access  Private (Admin)
const getDashboard = async (req, res) => {
  try {
    const users = await Signup.find({}, "FullName Email")
    return res.json({
      success: true,
      users,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Get login successful page with feed
// @route   GET /loginSuccessful
// @access  Private
const getLoginSuccessful = async (req, res) => {
  try {
    const sessionUser = req.session.user

    // Fetch user profile
    let SuccessProfile = await UserProfile.findOne({userId: sessionUser._id})
    const profileImg =
      SuccessProfile && SuccessProfile.profileImage
        ? SuccessProfile.profileImage
        : null
    const safeProfile = SuccessProfile || {
      headline: "",
      education: "",
      location: "",
      city: "",
      dob: "",
      contact: "",
      profileImage: null,
    }

    // Fetch all posts and populate user info
    const allPosts = await Post.find({}).sort({createdAt: -1}).populate("userId")
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

    // Fetch all users who have ever signed up (for contacts sidebar)
    const allUsers = await Signup.find({})
    const contacts = await Promise.all(
      allUsers.map(async (user) => {
        const userProfile = await UserProfile.findOne({userId: user._id})
        return {
          FullName: user.FullName,
          profileImg: userProfile?.profileImage || null,
          _id: user._id,
        }
      })
    )

    return res.json({
      success: true,
      user: {
        FullName: sessionUser.FullName || "User",
        profileImg,
        profile: safeProfile,
      },
      posts: postsWithUser,
      contacts,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Get home page
// @route   GET /home
// @access  Public
const getHome = (req, res) => {
  return res.json({
    success: true,
    message: "Welcome to the home page",
  })
}

// @desc    Add friend
// @route   POST /addfriend
// @access  Private
const addFriend = async (req, res) => {
  try {
    const currentUserId = req.session.user._id
    const {userId} = req.body

    // Check if trying to add themselves
    if (currentUserId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        error: "Cannot add yourself as friend",
      })
    }

    // Add friend to current user's profile
    await UserProfile.findOneAndUpdate(
      {userId: currentUserId},
      {$addToSet: {friends: userId}},
      {upsert: true}
    )

    // Add current user to friend's profile
    await UserProfile.findOneAndUpdate(
      {userId: userId},
      {$addToSet: {friends: currentUserId}},
      {upsert: true}
    )

    return res.json({success: true, message: "Friend added successfully"})
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Remove friend
// @route   POST /removefriend
// @access  Private
const removeFriend = async (req, res) => {
  try {
    const currentUserId = req.session.user._id
    const {userId} = req.body

    // Remove friend from current user's profile
    await UserProfile.findOneAndUpdate(
      {userId: currentUserId},
      {$pull: {friends: userId}}
    )

    // Remove current user from friend's profile
    await UserProfile.findOneAndUpdate(
      {userId: userId},
      {$pull: {friends: currentUserId}}
    )

    return res.json({success: true, message: "Friend removed successfully"})
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Get connections page
// @route   GET /connection
// @access  Private
const getConnections = async (req, res) => {
  try {
    const currentUserId = req.session.user._id

    // Get user profile with friends populated
    const userProfile = await UserProfile.findOne({
      userId: currentUserId,
    }).populate("friends")

    // Get all users for discovery
    const allUsers = await Signup.find({_id: {$ne: currentUserId}})

    return res.json({
      success: true,
      friends: userProfile?.friends || [],
      allUsers,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({success: false, error: "Server error"})
  }
}

// @desc    Get about page
// @route   GET /about
// @access  Public
const getAbout = (req, res) => {
  return res.json({
    success: true,
    message: "About page information",
  })
}

module.exports = {
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
}