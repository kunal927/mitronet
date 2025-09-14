import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    headline: "",
    education: "",
    location: "",
    city: "",
    contact: "",
    dob: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentProfile();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      const response = await fetch("https://mitronet.onrender.com/profile", {
        credentials: "include",
      });

      if (response.ok) {
        // Since backend returns HTML, we'll handle differently
        // For now, keep form fields empty for user to fill
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add profile image if selected
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      const response = await fetch(
        "https://mitronet.onrender.com/editprofile",
        {
          method: "POST",
          credentials: "include",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        navigate("/profile");
      } else {
        setErrors(["Failed to update profile"]);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors(["An error occurred while updating profile"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h1>Edit Profile</h1>
        <button className="cancel-btn" onClick={() => navigate("/profile")}>
          Cancel
        </button>
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

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-section">
          <h2>Profile Picture</h2>
          <div className="image-upload-section">
            <div className="current-image">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Preview"
                  className="image-preview"
                />
              ) : (
                <div className="image-placeholder">
                  <span>📷</span>
                  <p>No image selected</p>
                </div>
              )}
            </div>
            <div className="image-upload-controls">
              <input
                type="file"
                id="profileImage"
                accept="image/png,image/jpg,image/jpeg"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="profileImage" className="file-label">
                Choose Photo
              </label>
              <p className="file-hint">PNG, JPG or JPEG files only</p>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Personal Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="headline">Professional Headline</label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g., Software Developer at Tech Company"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="education">Education</label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g., Bachelor's in Computer Science"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, USA"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Manhattan"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact">Contact Information</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="e.g., +1 (555) 123-4567 or email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
