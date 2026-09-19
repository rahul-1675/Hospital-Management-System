import React from 'react';

const ReceptionistDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Receptionist Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Today's Appointments</h2>
                    <p className="text-3xl mt-2 font-bold text-blue-600">24</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Doctors on Duty</h2>
                    <p className="text-3xl mt-2 font-bold text-green-600">6</p>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;
