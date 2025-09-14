import React, {useState} from "react"
import {Link, useNavigate, useLocation} from "react-router-dom"
import {useAuth} from "../../contexts/AuthContext"
import "./Layout.css"

const Layout = ({children}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {user, logout, isAuthenticated} = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  if (!isAuthenticated) {
    return <div className="layout-container">{children}</div>
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="layout-container">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <button className="hamburger-btn" onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <Link to="/dashboard" className="logo">
              SocialConnect
            </Link>
          </div>

          <div className="header-right">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <nav className="sidebar-nav">
            <Link
              to="/dashboard"
              className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">🏠</span>
              Dashboard
            </Link>

            <Link
              to="/profile"
              className={`nav-item ${isActive("/profile") ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">👤</span>
              Profile
            </Link>

            <Link
              to="/create-post"
              className={`nav-item ${isActive("/create-post") ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">✏️</span>
              Create Post
            </Link>

            <Link
              to="/posts"
              className={`nav-item ${isActive("/posts") ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">📝</span>
              Posts
            </Link>

            <Link
              to="/connections"
              className={`nav-item ${isActive("/connections") ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">👥</span>
              Connections
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}

export default Layout
