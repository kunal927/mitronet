import React, {useState, useEffect} from "react"
import {useAuth} from "../../contexts/AuthContext"
import "./Connections.css"

const Connections = () => {
  const [connections, setConnections] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("connections")
  const {user} = useAuth()

  useEffect(() => {
    fetchConnectionsData()
  }, [])

  const fetchConnectionsData = async () => {
    try {
      // Since backend returns HTML, we'll mock the data structure
      // In a real implementation, you'd parse the HTML or modify backend to return JSON
      setConnections([])
      setAllUsers([])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching connections:", error)
      setLoading(false)
    }
  }

  const handleAddFriend = async (userId) => {
    try {
      const response = await fetch("http://localhost:3000/addfriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams({userId}),
      })

      if (response.ok) {
        fetchConnectionsData() // Refresh data
      }
    } catch (error) {
      console.error("Error adding friend:", error)
    }
  }

  const handleRemoveFriend = async (userId) => {
    try {
      const response = await fetch("http://localhost:3000/removefriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams({userId}),
      })

      if (response.ok) {
        fetchConnectionsData() // Refresh data
      }
    } catch (error) {
      console.error("Error removing friend:", error)
    }
  }

  if (loading) {
    return (
      <div className="connections-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading connections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="connections-container">
      <div className="connections-header">
        <h1>Your Network</h1>
        <div className="connections-stats">
          <div className="stat-item">
            <span className="stat-number">{connections.length}</span>
            <span className="stat-label">Connections</span>
          </div>
        </div>
      </div>

      <div className="connections-tabs">
        <button
          className={`tab-btn ${activeTab === "connections" ? "active" : ""}`}
          onClick={() => setActiveTab("connections")}
        >
          <span className="tab-icon">👥</span>
          My Connections ({connections.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "discover" ? "active" : ""}`}
          onClick={() => setActiveTab("discover")}
        >
          <span className="tab-icon">🔍</span>
          Discover People
        </button>
      </div>

      <div className="connections-content">
        {activeTab === "connections" ? (
          <div className="connections-list">
            {connections.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No connections yet</h3>
                <p>
                  Start connecting with people to build your professional
                  network!
                </p>
                <button
                  className="discover-btn"
                  onClick={() => setActiveTab("discover")}
                >
                  Discover People
                </button>
              </div>
            ) : (
              <div className="users-grid">
                {connections.map((connection) => (
                  <div key={connection._id} className="user-card">
                    <div className="user-avatar">
                      {connection.profileImg ? (
                        <img
                          src={`http://localhost:3000/${connection.profileImg}`}
                          alt={connection.FullName}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {connection.FullName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="user-info">
                      <h3 className="user-name">{connection.FullName}</h3>
                      <p className="user-title">Professional</p>
                    </div>
                    <div className="user-actions">
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFriend(connection._id)}
                      >
                        Remove
                      </button>
                      <button className="message-btn">Message</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="discover-section">
            {allUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No users to discover</h3>
                <p>Check back later for new people to connect with!</p>
              </div>
            ) : (
              <div className="users-grid">
                {allUsers.map((user) => (
                  <div key={user._id} className="user-card">
                    <div className="user-avatar">
                      {user.profileImg ? (
                        <img
                          src={`http://localhost:3000/${user.profileImg}`}
                          alt={user.FullName}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.FullName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="user-info">
                      <h3 className="user-name">{user.FullName}</h3>
                      <p className="user-title">Professional</p>
                    </div>
                    <div className="user-actions">
                      <button
                        className="connect-btn"
                        onClick={() => handleAddFriend(user._id)}
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Connections
