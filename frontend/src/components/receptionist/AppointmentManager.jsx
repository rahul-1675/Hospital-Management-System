import React from 'react';

const AppointmentManager = () => {
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Appointments</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">+ New Appointment</button>
            </div>
            <div className="border border-dashed border-gray-400 rounded-lg h-32 flex items-center justify-center text-gray-500">
                Drag and drop appointments here to reschedule
            </div>
            {/* Use shared AppointmentTable or similar list here */}
        </div>
    );
};

export default AppointmentManager;
