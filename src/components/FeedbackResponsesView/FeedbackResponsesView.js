import React from 'react';
import { X, User, Calendar, MessageSquare, TrendingUp, BarChart3, Trash2 } from 'lucide-react';
import StarRating from '../StarRating/StarRating';
import './FeedbackResponsesView.css';

const FeedbackResponsesView = ({ post, onClose, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
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



    const sortedRatings = [...(post.ratings || [])].sort((a, b) => {
        const dateA = a.ratedAt ? new Date(a.ratedAt) : new Date(0);
        const dateB = b.ratedAt ? new Date(b.ratedAt) : new Date(0);
        return dateB - dateA;
    });

    const handleDelete = () => {
        onDelete && onDelete(post.id);
        onClose();
    };

    return (
        <div className="responses-modal-overlay" onClick={onClose}>
            <div className="responses-modal" onClick={(e) => e.stopPropagation()}>
                <div className="responses-header">
                    <div>
                        <h2>Student Responses</h2>
                        <p className="responses-subtitle">{post.title}</p>
                    </div>
                    <div className="header-actions">
                        {onDelete && (
                            <button className="delete-btn" onClick={handleDelete} title="Delete Feedback">
                                <Trash2 size={20} />
                            </button>
                        )}
                        <button className="close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="responses-content">
                    {/* Feedback Request Details */}
                    <div className="request-details">
                        <h3>Feedback Request</h3>
                        <p className="request-text">{post.content}</p>
                        <div className="request-meta">
                            <span className="meta-badge">{post.category}</span>
                            <span className="meta-info">Posted {formatDate(post.createdAt)}</span>
                        </div>
                    </div>

                    {/* Statistics Overview */}
                    <div className="statistics-overview">
                        <div className="feedback-stat-card">
                            <div className="feedback-stat-icon">
                                <MessageSquare size={24} />
                            </div>
                            <div className="feedback-stat-content">
                                <div className="feedback-stat-value">{post.statistics.totalRatings}</div>
                                <div className="feedback-stat-label">Total Responses</div>
                            </div>
                        </div>

                        <div className="feedback-stat-card">
                            <div className="feedback-stat-icon">
                                <TrendingUp size={24} />
                            </div>
                            <div className="feedback-stat-content">
                                <div className="feedback-stat-value">{post.statistics.averageRating}</div>
                                <div className="feedback-stat-label">Average Rating</div>
                            </div>
                        </div>

                        <div className="feedback-stat-card">
                            <div className="feedback-stat-icon">
                                <BarChart3 size={24} />
                            </div>
                            <div className="feedback-stat-content">
                                <StarRating rating={parseFloat(post.statistics.averageRating)} readonly size={20} />
                                <div className="feedback-stat-label">Overall Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Individual Responses */}
                    <div className="responses-list">
                        <h3>Student Responses ({sortedRatings.length})</h3>
                        {sortedRatings.length === 0 ? (
                            <div className="no-responses">
                                <MessageSquare size={48} className="no-responses-icon" />
                                <p>No responses yet</p>
                                <p className="no-responses-subtitle">Students haven't provided feedback yet</p>
                            </div>
                        ) : (
                            <div className="response-items">
                                {sortedRatings.map((response, index) => (
                                    <div key={index} className="response-item">
                                        <div className="response-header">
                                            <div className="response-user">
                                                <User size={16} />
                                                <span className="response-name">{response.studentName}</span>
                                            </div>
                                            <div className="response-meta">
                                                <StarRating rating={response.rating} readonly size={16} />
                                                <span className="response-date">
                                                    <Calendar size={14} />
                                                    {formatDate(response.ratedAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="response-comment">
                                            <p>{response.comment || 'No comment provided'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackResponsesView;
