import React from 'react';

const DoctorCard = ({ doctor }) => {
    return (
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-400">Photo</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
            <p className="text-gray-600 text-sm mt-2">{doctor.experience} years experience</p>
            <button className="mt-4 w-full bg-blue-100 text-blue-600 py-2 rounded hover:bg-blue-200">
                View Profile
            </button>
        </div>
    );
};

export default DoctorCard;
