import React from "react"
import { LogOut, Bell, X, UserPlus, User } from "lucide-react"
import "./Sidebar.css"

const Sidebar = ({
  userName,
  user,
  onLogout,
  onNotificationsClick,
  notificationCount,
  onClose,
  showSettings,
  onSettingsClick,
}) => {
  const [showProfile, setShowProfile] = React.useState(false);

  // If user is not provided (e.g. from older parent components), we can't show profile
  // But based on our changes, it should be there.

  if (showProfile) {
    return (
      <div className="sidebar open">
        <div className="sidebar-header">
          <h3 className="sidebar-title">My Profile</h3>
          <button className="sidebar-close-btn" onClick={() => setShowProfile(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-content profile-content">
          <div className="profile-details">
            <div className="profile-item">
              <label>Full Name</label>
              <p className="profile-full-name">{user?.name || userName}</p>
            </div>
            <div className="profile-item">
              <label>Email</label>
              <p>{user?.email || 'N/A'}</p>
            </div>
            {user?.studentId && (
              <div className="profile-item">
                <label>Student ID</label>
                <p>{user.studentId}</p>
              </div>
            )}
            {user?.adminId && (
              <div className="profile-item">
                <label>Admin ID</label>
                <p>{user.adminId}</p>
              </div>
            )}
            {user?.course && (
              <div className="profile-item">
                <label>Course</label>
                <p>{user.course}</p>
              </div>
            )}
            {user?.gender && (
              <div className="profile-item">
                <label>Gender</label>
                <p>{user.gender}</p>
              </div>
            )}

          </div>
          <button className="sidebar-back-btn" onClick={() => setShowProfile(false)}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar open">
      <div className="sidebar-header">
        <h3 className="sidebar-welcome">Welcome, {userName}</h3>
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="sidebar-content">
        <button
          className="sidebar-action-btn"
          onClick={() => setShowProfile(true)}
        >
          <User size={18} />
          <span>Profile</span>
        </button>

        {onNotificationsClick && (
          <button
            className="sidebar-action-btn"
            onClick={() => {
              if (onNotificationsClick) onNotificationsClick()
              onClose()
            }}
          >
            <Bell size={18} />
            <span>Notifications</span>
            {notificationCount > 0 && (
              <span className="notification-dot-sidebar"></span>
            )}
          </button>
        )}
        {showSettings && (
          <button
            className="sidebar-action-btn"
            onClick={() => {
              onSettingsClick()
              onClose()
            }}
          >
            <UserPlus size={18} />
            <span>Add Admin</span>
          </button>
        )}
        <button className="sidebar-action-btn" onClick={onLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
