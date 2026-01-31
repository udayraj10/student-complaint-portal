import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import './StatsGrid.css';

const StatsGrid = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <FileText className="stat-icon" size={18} />
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-value">{stats.total}</div>
      </div>
      <div className="stat-card">
        <div className="stat-header">
          <Clock className="stat-icon pending" size={18} />
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-value">{stats.pending}</div>
      </div>
      <div className="stat-card">
        <div className="stat-header">
          <AlertCircle className="stat-icon in-progress" size={18} />
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-value">{stats.inProgress}</div>
      </div>
      <div className="stat-card">
        <div className="stat-header">
          <CheckCircle className="stat-icon resolved" size={18} />
          <span className="stat-label">Resolved</span>
        </div>
        <div className="stat-value">{stats.resolved}</div>
      </div>
    </div>
  );
};

export default StatsGrid;
