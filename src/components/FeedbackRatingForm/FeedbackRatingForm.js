import React, { useState, useEffect } from 'react';
import { Send, X, AlertCircle, Calendar, Tag, User } from 'lucide-react';
import StarRating from '../StarRating/StarRating';
import { feedbackSystemService } from '../../services/feedbackSystemService';
import './FeedbackRatingForm.css';

const FeedbackRatingForm = ({ post, studentId, studentName, onClose, onSubmitSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [existingRating, setExistingRating] = useState(null);

    useEffect(() => {
        const fetchRating = async () => {
            // Check if student has already rated
            try {
                const existing = await feedbackSystemService.getStudentRating(post.id, studentId);
                if (existing) {
                    setExistingRating(existing);
                    setRating(existing.rating);
                    setComment(existing.comment || '');
                }
            } catch (error) {
                console.error("Error fetching rating:", error);
            }
        };

        fetchRating();
    }, [post.id, studentId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        // Check if comment is provided but too short (if it has content)
        if (comment && comment.trim().length > 0 && comment.trim().length < 3) {
            setError('Please provide slightly more detail (minimum 3 characters) or leave blank');
            return;
        }

        setLoading(true);

        try {
            feedbackSystemService.submitRating(
                post.id,
                studentId,
                studentName,
                rating,
                comment
            );

            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
            if (onClose) {
                onClose();
            }
        } catch (err) {
            setError(err.message || 'Failed to submit rating');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-rating-modal-overlay" onClick={onClose}>
            <div className="feedback-rating-modal" onClick={(e) => e.stopPropagation()}>
                <div className="rating-modal-header">
                    <h2>Provide Your Feedback</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="feedback-post-preview">
                    <h3 className="preview-title">{post.title}</h3>
                    <div className="preview-meta">
                        <span className="meta-item">
                            <Tag size={14} />
                            {post.category}
                        </span>
                        <span className="meta-item">
                            <User size={14} />
                            {post.adminName}
                        </span>
                        <span className="meta-item">
                            <Calendar size={14} />
                            {formatDate(post.createdAt)}
                        </span>
                    </div>
                    <p className="preview-content">{post.content}</p>
                </div>

                <form onSubmit={handleSubmit} className="rating-form">
                    <div className="rating-section">
                        <label>Your Rating *</label>
                        <div className="rating-input">
                            <StarRating
                                rating={rating}
                                onRatingChange={setRating}
                                size={32}
                            />
                            {rating > 0 && (
                                <span className="rating-text">
                                    {rating === 1 && 'Poor'}
                                    {rating === 2 && 'Fair'}
                                    {rating === 3 && 'Good'}
                                    {rating === 4 && 'Very Good'}
                                    {rating === 5 && 'Excellent'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="comment-section">
                        <label htmlFor="comment">Your Detailed Feedback (Optional)</label>
                        <textarea
                            id="comment"
                            placeholder="Please share your detailed feedback and suggestions..."
                            rows={5}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        // required removed
                        />
                        <span className="char-count">{comment.length} characters</span>
                    </div>

                    {existingRating && (
                        <div className="info-message">
                            <AlertCircle size={18} />
                            You previously submitted feedback. Submitting will update your response.
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="rating-form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button" disabled={loading || rating === 0}>
                            <Send size={18} />
                            {loading ? 'Submitting...' : existingRating ? 'Update Feedback' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackRatingForm;
