import React from 'react';

const PatientDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">My Appointments</h2>
                    <p className="text-gray-600">View and book appointments</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Medical Records</h2>
                    <p className="text-gray-600">Access your history and prescriptions</p>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
