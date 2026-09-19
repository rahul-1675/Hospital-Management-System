import React from 'react';

const DoctorDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Appointments</h2>
                    <p className="text-3xl mt-2 font-bold text-blue-600">8</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Patients</h2>
                    <p className="text-3xl mt-2 font-bold text-green-600">12</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Prescriptions</h2>
                    <p className="text-3xl mt-2 font-bold text-purple-600">5</p>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
