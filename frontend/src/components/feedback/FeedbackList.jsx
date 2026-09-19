import React from 'react';
import RatingStars from './RatingStars';

const FeedbackList = () => {
    const feedbacks = [
        { id: 1, user: 'John Doe', rating: 5, comment: 'Excellent service and friendly staff!' },
        { id: 2, user: 'Jane Smith', rating: 4, comment: 'Good experience, but waiting time was long.' },
    ];

    return (
        <div className="max-w-2xl mx-auto my-10">
            <h3 className="text-xl font-bold mb-4">Patient Reviews</h3>
            <div className="space-y-4">
                {feedbacks.map((fb) => (
                    <div key={fb.id} className="bg-white p-4 rounded shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold">{fb.user}</h4>
                            <RatingStars rating={fb.rating} readonly />
                        </div>
                        <p className="text-gray-700">{fb.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackList;
