import React, { useState } from "react"
import { User } from "lucide-react"
import logoImage from "../../assets/images/logo.png"
import Sidebar from "../Sidebar/Sidebar"
import "./Header.css"

const Header = ({
  title,
  userName,
  user,
  onLogout,
  onNotificationsClick,
  notificationCount,
  showSettings,
  onSettingsClick,
  onHomeClick,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick()
    }
  }

  return (
    <>
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div
              className="university-logo-container"
              onClick={handleHomeClick}
              style={{ cursor: onHomeClick ? 'pointer' : 'default' }}
            >
              <img
                src={logoImage}
                alt="Sri Venkateshwara University Logo"
                className="university-logo"
              />
            </div>
            <div className="university-info">
              <h2
                className="university-name"
                onClick={handleHomeClick}
                style={{ cursor: onHomeClick ? 'pointer' : 'default' }}
              >
                Sri Venkateshwara University
              </h2>
              <p className="accreditation-text">
                Accredited by NAAC with A+ Grade
              </p>
            </div>
          </div>

          <div className="header-right">
            <div className="header-actions">
              <button className="profile-btn" onClick={toggleSidebar}>
                <User size={18} />
                <span>{title}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      {isSidebarOpen && (
        <Sidebar
          userName={userName}
          user={user}
          onLogout={onLogout}
          onNotificationsClick={onNotificationsClick}
          notificationCount={notificationCount}
          onClose={toggleSidebar}
          showSettings={showSettings}
          onSettingsClick={onSettingsClick}
        />
      )}
    </>
  )
}

export default Header
