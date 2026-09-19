import React from 'react';

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-xl text-gray-700">Page Not Found</p>
            <a href="/" className="mt-4 text-blue-500 hover:underline">Go Home</a>
        </div>
    );
};

export default NotFound;
