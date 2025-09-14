// Response utility functions
const sendResponse = (
  req,
  res,
  statusCode,
  data,
  template = null,
  templateData = {}
) => {
  // Check if request wants JSON response
  if (
    req.headers["accept"] &&
    req.headers["accept"].includes("application/json")
  ) {
    return res.status(statusCode).json(data)
  }

  // For web requests
  if (template) {
    return res.status(statusCode).render(template, templateData)
  }

  res.status(statusCode).send(data.message || "Success")
}

// Success response
const sendSuccess = (req, res, data, template = null, templateData = {}) => {
  return sendResponse(
    req,
    res,
    200,
    {success: true, ...data},
    template,
    templateData
  )
}

// Error response
const sendError = (
  req,
  res,
  statusCode,
  error,
  template = null,
  templateData = {}
) => {
  const errorData = {success: false, error}
  return sendResponse(req, res, statusCode, errorData, template, templateData)
}

// Validation response
const sendValidationError = (
  req,
  res,
  errors,
  template = null,
  templateData = {}
) => {
  const errorData = {
    success: false,
    error: Array.isArray(errors) ? errors.join(", ") : errors,
    errors: Array.isArray(errors) ? errors : [errors],
  }
  return sendResponse(req, res, 400, errorData, template, templateData)
}

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendValidationError,
}
