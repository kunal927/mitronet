import React, {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import {useAuth} from "../../contexts/AuthContext"
import "./Profile.css"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const {user} = useAuth()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProfile({
          FullName: data.user?.FullName || "User",
          headline: data.profile?.headline || "",
          education: data.profile?.education || "",
          location: data.profile?.location || "",
          city: data.profile?.city || "",
          contact: data.profile?.contact || "",
          profileImage: data.profile?.profileImage || null,
        })
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  const defaultProfile = {
    FullName: "User",
    headline: "Add your professional headline",
    education: "Add your education",
    location: "Add your location",
    city: "Add your city",
    contact: "Add your contact information",
    profileImage: null,
  }

  const displayProfile = profile || defaultProfile

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <Link to="/edit-profile" className="edit-profile-btn">
          Edit Profile
        </Link>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-banner">
            <div className="profile-image-container">
              {displayProfile.profileImage ? (
                <img
                  src={`http://localhost:3000/${displayProfile.profileImage}`}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  {displayProfile.FullName.charAt(0)}
                </div>
              )}
              <Link to="/edit-profile" className="edit-image-btn">
                📷
              </Link>
            </div>
          </div>

          <div className="profile-info">
            <h2 className="profile-name">{displayProfile.FullName}</h2>

            <div className="profile-fields">
              <div className="profile-field">
                <div className="field-header">
                  <span className="field-icon">💼</span>
                  <span className="field-label">Headline</span>
                </div>
                <p className="field-value">
                  {displayProfile.headline || "Add your professional headline"}
                </p>
              </div>

              <div className="profile-field">
                <div className="field-header">
                  <span className="field-icon">🎓</span>
                  <span className="field-label">Education</span>
                </div>
                <p className="field-value">
                  {displayProfile.education || "Add your education background"}
                </p>
              </div>

              <div className="profile-field">
                <div className="field-header">
                  <span className="field-icon">📍</span>
                  <span className="field-label">Location</span>
                </div>
                <p className="field-value">
                  {displayProfile.location || "Add your location"}
                </p>
              </div>

              <div className="profile-field">
                <div className="field-header">
                  <span className="field-icon">🏙️</span>
                  <span className="field-label">City</span>
                </div>
                <p className="field-value">
                  {displayProfile.city || "Add your city"}
                </p>
              </div>

              <div className="profile-field">
                <div className="field-header">
                  <span className="field-icon">📞</span>
                  <span className="field-label">Contact</span>
                </div>
                <p className="field-value">
                  {displayProfile.contact || "Add your contact information"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <div className="action-card">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <Link to="/edit-profile" className="action-item">
                <span className="action-icon">✏️</span>
                <span>Edit Profile</span>
              </Link>
              <Link to="/create-post" className="action-item">
                <span className="action-icon">📝</span>
                <span>Create Post</span>
              </Link>
              <Link to="/connections" className="action-item">
                <span className="action-icon">👥</span>
                <span>View Connections</span>
              </Link>
              <Link to="/dashboard" className="action-item">
                <span className="action-icon">🏠</span>
                <span>Go to Feed</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
