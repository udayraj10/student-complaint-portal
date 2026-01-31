import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = 24 }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (!readonly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div className={`star-rating ${readonly ? 'readonly' : 'interactive'}`}>
            {[1, 2, 3, 4, 5].map((value) => (
                <Star
                    key={value}
                    size={size}
                    className={`star ${value <= displayRating ? 'filled' : 'empty'}`}
                    onClick={() => handleClick(value)}
                    onMouseEnter={() => handleMouseEnter(value)}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: readonly ? 'default' : 'pointer' }}
                />
            ))}
            {rating > 0 && (
                <span className="rating-value">
                    {typeof rating === 'number' ? rating.toFixed(1) : rating}
                </span>
            )}
        </div>
    );
};

export default StarRating;
