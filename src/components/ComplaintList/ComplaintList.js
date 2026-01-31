import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Calendar, User } from 'lucide-react';
import './ComplaintList.css';

const ComplaintList = ({ complaints, onSelectComplaint }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="status-icon pending" size={18} />,
          label: 'Pending',
          className: 'status-badge pending'
        };
      case 'in-progress':
        return {
          icon: <AlertCircle className="status-icon in-progress" size={18} />,
          label: 'In Progress',
          className: 'status-badge in-progress'
        };
      case 'resolved':
        return {
          icon: <CheckCircle className="status-icon resolved" size={18} />,
          label: 'Resolved',
          className: 'status-badge resolved'
        };
      case 'rejected':
        return {
          icon: <XCircle className="status-icon rejected" size={18} />,
          label: 'Rejected',
          className: 'status-badge rejected'
        };
      default:
        return {
          icon: <Clock className="status-icon pending" size={18} />,
          label: 'Pending',
          className: 'status-badge pending'
        };
    }
  };

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

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="complaint-list">
      {complaints.map((complaint) => {
        const statusInfo = getStatusInfo(complaint.status);
        return (
          <div
            key={complaint.id}
            className={`complaint-item ${onSelectComplaint ? 'clickable' : ''}`}
            onClick={() => onSelectComplaint && onSelectComplaint(complaint)}
          >
            <div className="complaint-header">
              <h3 className="complaint-title">{complaint.title}</h3>
              <div className={`${statusInfo.className} status-badge`}>
                {statusInfo.icon}
                {statusInfo.label}
              </div>
            </div>

            <p className="complaint-description">
              {truncateText(complaint.description || '')}
            </p>

            <div className="complaint-footer">
              <div className="complaint-info">
                <span className="info-item">
                  <User size={14} />
                  {complaint.userName || 'Unknown'} {complaint.studentId && `(${complaint.studentId})`}
                </span>
                <span className="info-item">
                  <Calendar size={14} />
                  {formatDate(complaint.createdAt)}
                </span>
              </div>
              {onSelectComplaint && (
                <ChevronRight className="chevron-icon" size={20} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComplaintList;

