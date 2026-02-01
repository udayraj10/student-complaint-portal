import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { feedbackSystemService } from '../../services/feedbackSystemService';
import './FeedbackPostForm.css';

const FeedbackPostForm = ({ adminId, adminName, onSubmitSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        content: '',
        category: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = [
        'Hostel Food Quality',
        'Campus Hygiene',
        'Infrastructure',
        'Library Services',
        'Transportation',
        'Academic Support',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.content || !formData.category) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            const newPost = feedbackSystemService.createFeedbackPost({
                title: `${formData.category} Feedback Request`,
                ...formData,
                targetAudience: 'all',
                targetStudentIds: [],
                adminId,
                adminName
            });

            // Reset form
            setFormData({
                content: '',
                category: ''
            });

            if (onSubmitSuccess) {
                onSubmitSuccess(newPost);
            }
        } catch (err) {
            setError(err.message || 'Failed to post feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-post-form-container">
            <div className="feedback-post-form-card">
                <div className="form-header">
                    <h2>Request Feedback from Students</h2>

                </div>

                <form onSubmit={handleSubmit} className="feedback-post-form">
                    <div className="form-group">
                        <label htmlFor="category" className="form-label">Category *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="form-control"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="content" className="form-label">Feedback Request / Question *</label>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="What would you like feedback on?"
                            rows={8}
                            value={formData.content}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        {onCancel && (
                            <button type="button" className="secondary-btn" onClick={onCancel}>
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="primary-btn" disabled={loading}>
                            <Send size={18} />
                            {loading ? 'Requesting...' : 'Request Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPostForm;
