import React from 'react';
import { X, MessageSquare, Calendar } from 'lucide-react';
import './Notifications.css';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

const Notifications = ({ isOpen, onClose, notifications, onNotificationClick }) => {
  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="notifications-overlay" onClick={onClose}></div>}

      {/* Sidebar */}
      <div className={`notifications-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="notifications-header">
          <div className="notifications-title-section">
            <MessageSquare size={24} className="notifications-icon" />
            <h2>Notifications</h2>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="notifications-content">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <MessageSquare size={48} className="empty-icon" />
              <p>No notifications</p>
              <p className="empty-subtitle">You'll see updates here</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="notification-item"
                  onClick={() => handleNotificationClick(notification)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-date">
                      <Calendar size={12} />
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.seen && <span className="unread-indicator"></span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
