import React, {useState} from "react"
import {useAuth} from "../../contexts/AuthContext"
import {Link, useNavigate} from "react-router-dom"
import "./Auth.css"

const Signup = () => {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
  })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const {signup} = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const newErrors = []

    // Name validation
    if (!formData.FullName.trim()) {
      newErrors.push("Name is required")
    } else if (formData.FullName.trim().length < 5) {
      newErrors.push("Name must be at least 5 characters long")
    } else if (!/^[A-Za-z\s]+$/.test(formData.FullName)) {
      newErrors.push("Name must contain only letters and spaces")
    }

    // Email validation
    if (!formData.Email.trim()) {
      newErrors.push("Email is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.push("Please provide a valid email address")
    }

    // Password validation
    if (!formData.Password) {
      newErrors.push("Password is required")
    } else if (formData.Password.length < 6) {
      newErrors.push("Password must be at least 6 characters long")
    } else if (!/[0-9]/.test(formData.Password)) {
      newErrors.push("Password must contain at least one number")
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      const result = await signup(formData)

      if (result.success) {
        navigate("/login")
      } else {
        setErrors([result.error || "Signup failed"])
      }
    } catch (error) {
      setErrors(["An error occurred during signup"])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up to get started</p>
        </div>

        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                {error}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="FullName">Full Name</label>
            <input
              type="text"
              id="FullName"
              name="FullName"
              value={formData.FullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Email">Email Address</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              id="Password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
