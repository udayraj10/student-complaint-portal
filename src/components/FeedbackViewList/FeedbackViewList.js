import React from 'react';
import { Calendar, Tag, User, CheckCircle, MessageSquare } from 'lucide-react';
import StarRating from '../StarRating/StarRating';
import './FeedbackViewList.css';

const FeedbackViewList = ({ posts, studentId, onSelectPost }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const truncateText = (text, maxLength = 250) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const hasRated = (post) => {
        return post.ratings && post.ratings.some(r => r.studentId === studentId);
    };

    if (!posts || posts.length === 0) {
        return (
            <div className="empty-feedback-view">
                <MessageSquare size={48} className="empty-icon" />
                <p>No feedback requests available</p>
                <p className="empty-subtitle">Your admin hasn't requested any feedback yet</p>
            </div>
        );
    }

    return (
        <div className="feedback-view-list">
            {posts.map((post) => {
                const rated = hasRated(post);
                return (
                    <div
                        key={post.id}
                        className="feedback-view-item"
                        onClick={() => onSelectPost && onSelectPost(post)}
                    >
                        <div className="view-header">
                            <div className="view-title-section">
                                <h3 className="view-title">{post.title}</h3>
                                <div className="view-meta">
                                    <span className="category-badge">
                                        <Tag size={14} />
                                        {post.category}
                                    </span>
                                    {rated && (
                                        <span className="rated-badge">
                                            <CheckCircle size={14} />
                                            You rated this
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="view-content">{truncateText(post.content)}</p>

                        <div className="view-footer">
                            <div className="view-info">
                                <span className="info-item">
                                    <User size={14} />
                                    {post.adminName}
                                </span>
                                <span className="info-item">
                                    <Calendar size={14} />
                                    {formatDate(post.createdAt)}
                                </span>
                            </div>
                            <div className="rating-display">
                                <StarRating
                                    rating={parseFloat(post.statistics.averageRating)}
                                    readonly
                                    size={16}
                                />
                                <span className="rating-count">
                                    ({post.statistics.totalRatings})
                                </span>
                            </div>
                        </div>

                        {!rated && (
                            <div className="rate-prompt">
                                <span>Click to provide your feedback</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default FeedbackViewList;
