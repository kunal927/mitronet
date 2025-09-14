const bcrypt = require("bcryptjs")
const Signup = require("../models/signup")

// @desc    Get signup page
// @route   GET /signup
// @access  Public
const getSignup = (req, res) => {
  return res.json({
    success: true,
    message: "Signup page",
  })
}

// @desc    Register new user
// @route   POST /signup
// @access  Public
const signup = async (req, res) => {
  const {FullName, Email, Password} = req.body

  // Check for validation errors from middleware
  if (req.validationErrors) {
    // Check if request wants JSON response
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res.status(400).json({
        success: false,
        error: req.validationErrors.join(", "),
      })
    }
    return res.status(400).render("signup", {
      title: "Signup Page using JWT",
      errors: req.validationErrors,
      oldInput: {FullName, Email, Password},
    })
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 12)

    // Save user with hashed password
    const newUser = new Signup({
      FullName,
      Email,
      Password: hashedPassword,
    })

    await newUser.save()
    console.log("✅ User saved successfully")
    req.session.isAuth = false

    // Check if request wants JSON response
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res.json({success: true, message: "User created successfully"})
    }

    return res.json({success: true, message: "User created successfully"})
  } catch (err) {
    console.error("❌ Error saving user:", err)

    if (err.code === 11000) {
      // Check if request wants JSON response
      if (
        req.headers["accept"] &&
        req.headers["accept"].includes("application/json")
      ) {
        return res
          .status(400)
          .json({success: false, error: "Email already exists"})
      }
      return res.status(400).render("signup", {
        title: "Signup Page using JWT",
        errors: ["Email already exists"],
        oldInput: {FullName, Email, Password},
      })
    }

    // Check if request wants JSON response
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res.status(500).json({success: false, error: "Server error"})
    }
    res.status(500).send("Server error")
  }
}

// @desc    Get login page
// @route   GET /login
// @access  Public
const getLogin = (req, res) => {
  req.session.isAuth = false
  return res.json({
    success: true,
    message: "Login page",
  })
}

// @desc    Authenticate user
// @route   POST /login
// @access  Public
const login = async (req, res) => {
  console.log("Login request body:", req.body)
  console.log("Login request headers:", req.headers)

  const {Email, Password} = req.body

  // Validate that both fields are present
  if (!Email || !Password) {
    console.log("Missing email or password")
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res
        .status(400)
        .json({success: false, error: "Email and Password are required"})
    }
    return res.status(400).render("login", {
      title: "Login",
      errors: ["Email and Password are required"],
      oldInput: {Email: Email || ""},
    })
  }

  try {
    // Find user by email
    const user = await Signup.findOne({Email})
    if (!user) {
      // Check if request wants JSON response
      if (
        req.headers["accept"] &&
        req.headers["accept"].includes("application/json")
      ) {
        return res
          .status(400)
          .json({success: false, error: "Invalid Email or Password"})
      }
      return res.status(400).render("login", {
        title: "Login",
        errors: ["Invalid Email or Password"],
        oldInput: {Email},
      })
    }

    // Compare password
    const isMatch = await bcrypt.compare(Password, user.Password)
    if (!isMatch) {
      // Check if request wants JSON response
      if (
        req.headers["accept"] &&
        req.headers["accept"].includes("application/json")
      ) {
        return res
          .status(400)
          .json({success: false, error: "Invalid Email or Password"})
      }
      return res.status(400).render("login", {
        title: "Login",
        errors: ["Invalid Email or Password"],
        oldInput: {Email},
      })
    }

    // Password correct → set session
    req.session.isAuth = true
    req.session.user = user
    
    // Save session explicitly and wait for it
    return new Promise((resolve) => {
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err)
          return res.status(500).json({success: false, error: "Session creation failed"})
        }
        console.log('✅ Session saved successfully:', req.session.id)
        
        // Check if request wants JSON response
        if (
          req.headers["accept"] &&
          req.headers["accept"].includes("application/json")
        ) {
          return res.json({
            success: true,
            user: {id: user._id, FullName: user.FullName, Email: user.Email},
          })
        }
        res.redirect("/loginSuccessful")
        resolve()
      })
    })


  } catch (err) {
    console.error(err)
    // Check if request wants JSON response
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res.status(500).json({success: false, error: "Server error"})
    }
    res.status(500).send("Server error")
  }
}

// @desc    Logout user
// @route   POST /logout
// @access  Private
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err)
      if (
        req.headers["accept"] &&
        req.headers["accept"].includes("application/json")
      ) {
        return res.status(500).json({success: false, error: "Logout failed"})
      }
      return res.status(500).send("Logout failed")
    }

    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res.json({success: true, message: "Logged out successfully"})
    }
    res.redirect("/login")
  })
}

module.exports = {
  getSignup,
  signup,
  getLogin,
  login,
  logout,
}
