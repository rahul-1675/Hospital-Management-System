import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Users</h2>
                    <p className="text-gray-600">Manage system users and roles</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Hospital Stats</h2>
                    <p className="text-gray-600">View overall hospital performance</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Settings</h2>
                    <p className="text-gray-600">System configuration</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
