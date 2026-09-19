import React from 'react';

const RatingStars = ({ rating, onRate, readonly = false }) => {
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => !readonly && onRate && onRate(star)}
                    className={`text-2xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${readonly ? 'cursor-default' : 'hover:scale-110'}`}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

export default RatingStars;
