import React from 'react';
import { Calendar, Tag, TrendingUp } from 'lucide-react';
import StarRating from '../StarRating/StarRating';
import './FeedbackPostList.css';

const FeedbackPostList = ({ posts, onSelectPost, onDeletePost, showActions = true }) => {
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

    const truncateText = (text, maxLength = 200) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (!posts || posts.length === 0) {
        return (
            <div className="empty-feedback-posts">
                <TrendingUp size={48} className="empty-icon" />
                <p>No feedback posts yet</p>
                <p className="empty-subtitle">Create your first feedback post to share with students</p>
            </div>
        );
    }

    return (
        <div className="feedback-post-list">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className={`feedback-post-item ${onSelectPost ? 'clickable' : ''}`}
                    onClick={() => onSelectPost && onSelectPost(post)}
                >
                    <div className="post-header">
                        <div className="post-title-section">
                            <h3 className="post-title">{post.title}</h3>
                            <span className="category-badge">
                                <Tag size={14} />
                                {post.category}
                            </span>
                        </div>
                    </div>

                    <p className="post-content">{truncateText(post.content)}</p>

                    <div className="post-footer">
                        <div className="post-info">
                            <span className="info-item">
                                <Calendar size={14} />
                                {formatDate(post.createdAt)}
                            </span>
                            <div className="rating-info">
                                <StarRating rating={parseFloat(post.statistics.averageRating)} readonly size={16} />
                                <span className="rating-count">
                                    ({post.statistics.totalRatings} {post.statistics.totalRatings === 1 ? 'rating' : 'ratings'})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedbackPostList;
