import React, { useState } from 'react';
import RatingStars from './RatingStars';

const FeedbackForm = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ rating, comment });
        alert('Thank you for your feedback!');
        setRating(0);
        setComment('');
    };

    return (
        <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto my-10">
            <h2 className="text-2xl font-bold text-center mb-6">Rate Your Experience</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center mb-6">
                    <RatingStars rating={rating} onRate={setRating} />
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    rows="4"
                    placeholder="Share your thoughts..."
                ></textarea>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
            </form>
        </div>
    );
};

export default FeedbackForm;
