// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err);

  // Handle different types of errors
  if (err.code === 11000) {
    // MongoDB duplicate key error
    return res.status(400).json({
      success: false,
      error: "Email already exists",
    });
  }

  if (err.name === "ValidationError") {
    // Mongoose validation error
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: errors.join(", "),
    });
  }

  if (err.name === "CastError") {
    // Invalid ObjectId
    return res.status(400).json({
      success: false,
      error: "Invalid ID format",
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};

// 404 handler
const notFound = (req, res, next) => {
  return res.status(404).json({
    success: false,
    error: "Route not found",
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
};
