import React from 'react';

const PatientCard = ({ patient }) => {
    return (
        <div className="border rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-50">
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">
                {patient.name.charAt(0)}
            </div>
            <div>
                <h4 className="font-semibold text-lg">{patient.name}</h4>
                <p className="text-gray-500 text-sm">Age: {patient.age} | Gender: {patient.gender}</p>
            </div>
            <div className="ml-auto">
                <button className="text-blue-500 text-sm hover:underline">History</button>
            </div>
        </div>
    );
};

export default PatientCard;
