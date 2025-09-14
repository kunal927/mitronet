// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (!req.session.isAuth) {
    // Check if request wants JSON response
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res
        .status(401)
        .json({success: false, error: "Authentication required"})
    }
    return res.redirect("/login")
  }
  next()
}

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.session.isAuth) {
    // Check if request wants JSON response
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res
        .status(401)
        .json({success: false, error: "Authentication required"})
    }
    return res.redirect("/login")
  }

  const userEmail = req.session.user.Email
  const userPassword = req.session.user.Password

  if (userEmail !== "admin@gmail.com" || userPassword !== "admin123") {
    // Check if request wants JSON response
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res
        .status(403)
        .json({success: false, error: "Admin access required"})
    }
    return res.render("admin")
  }

  next()
}

// Set authentication status for all requests
const setAuthStatus = (req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn
  next()
}

module.exports = {
  isAuthenticated,
  isAdmin,
  setAuthStatus,
}
