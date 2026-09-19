import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="text-2xl mt-4">Page Not Found</p>
            <Link to="/" className="mt-6 text-blue-500 hover:underline">Go back to Home</Link>
        </div>
    );
};

export default NotFound;
