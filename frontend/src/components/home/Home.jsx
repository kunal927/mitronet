import React from "react"
import {Link} from "react-router-dom"
import "./Home.css"

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="brand">SocialConnect</span>
          </h1>
          <p className="hero-subtitle">
            Connect with friends, share moments, and build your professional
            network
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-graphic">
            <div className="graphic-circle">🌐</div>
            <div className="graphic-circle">👥</div>
            <div className="graphic-circle">💬</div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose SocialConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Connect</h3>
              <p>Build meaningful connections with friends and professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Share</h3>
              <p>
                Share your thoughts, experiences, and moments with your network
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Network</h3>
              <p>
                Grow your professional network and discover new opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
