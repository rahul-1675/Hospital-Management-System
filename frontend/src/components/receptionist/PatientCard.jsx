import React from 'react';

const PatientCard = ({ patient }) => {
    // Receptionist view might have different actions like 'Check In'
    return (
        <div className="border rounded-lg p-4 flex items-center justify-between bg-white shadow-sm">
            <div>
                <h4 className="font-bold text-gray-800">{patient?.name || 'Unknown Patient'}</h4>
                <p className="text-sm text-gray-500">ID: {patient?.id || 'N/A'}</p>
            </div>
            <div>
                <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded mr-2">Check In</button>
                <button className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded">Edit</button>
            </div>
        </div>
    );
};

export default PatientCard;
