import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PostCard from "../posts/PostCard";
import CreatePostModal from "../posts/CreatePostModal";
import "./Dashboard.css";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        "https://mitronet.onrender.com/loginSuccessful",
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        setContacts(data.contacts || []);
        setUserProfile(data.user || null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await fetch(
        "https://mitronet.onrender.com/createpost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          credentials: "include",
          body: new URLSearchParams({ content: postData.content }),
        }
      );

      if (response.ok) {
        setShowCreatePost(false);
        fetchDashboardData(); // Refresh posts
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await fetch(`https://mitronet.onrender.com/like/${postId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });
      fetchDashboardData(); // Refresh posts
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await fetch(`https://mitronet.onrender.com/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        credentials: "include",
        body: new URLSearchParams({ comment }),
      });
      fetchDashboardData(); // Refresh posts
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back!</h1>
        <button
          className="create-post-btn"
          onClick={() => setShowCreatePost(true)}
        >
          Create Post
        </button>
      </div>

      <div className="dashboard-content">
        {/* Main Feed */}
        <div className="feed-section">
          <div className="feed-header">
            <h2>Recent Posts</h2>
          </div>

          <div className="posts-container">
            {posts.length === 0 ? (
              <div className="empty-feed">
                <div className="empty-icon">📝</div>
                <h3>No posts yet</h3>
                <p>Be the first to share something with your network!</p>
                <button
                  className="create-first-post-btn"
                  onClick={() => setShowCreatePost(true)}
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar with Contacts */}
        <div className="sidebar-section">
          <div className="contacts-widget">
            <h3>Your Network</h3>
            <div className="contacts-list">
              {contacts.length === 0 ? (
                <div className="empty-contacts">
                  <p>No connections yet</p>
                  <small>Start connecting with people to see them here</small>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div key={contact._id} className="contact-item">
                    <div className="contact-avatar">
                      {contact.profileImg ? (
                        <img
                          src={`https://mitronet.onrender.com/${contact.profileImg}`}
                          alt={contact.FullName}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {contact.FullName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="contact-info">
                      <span className="contact-name">{contact.FullName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn">
                <span>👤</span>
                View Profile
              </button>
              <button className="action-btn">
                <span>👥</span>
                Find Friends
              </button>
              <button className="action-btn">
                <span>⚙️</span>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
};

export default Dashboard;
