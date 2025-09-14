const {check, validationResult} = require("express-validator")

// Validation rules for user signup
const validateSignup = [
  check("FullName")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({min: 5})
    .withMessage("Name must be at least 5 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters and spaces"),

  check("Email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  check("Password")
    .notEmpty()
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters long")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
]

// Validation rules for user login
const validateLogin = [
  check("Email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  check("Password").notEmpty().withMessage("Password is required"),
]

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg)

    // Check if request wants JSON response
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res.status(400).json({
        success: false,
        error: errorMessages.join(", "),
        errors: errorMessages,
      })
    }

    // For web requests, store errors in request for view rendering
    req.validationErrors = errorMessages
    req.oldInput = req.body
  }

  next()
}

module.exports = {
  validateSignup,
  validateLogin,
  handleValidationErrors,
}
