import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="toast-container">
      <div className="toast-message">{message}</div>
      <button className="toast-close-btn" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
