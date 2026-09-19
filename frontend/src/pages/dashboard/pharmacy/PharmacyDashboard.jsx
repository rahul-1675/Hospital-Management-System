import React from 'react';

const PharmacyDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pharmacy Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Total Stock</h2>
                    <p className="text-3xl mt-2 font-bold text-blue-600">12,450</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Pending Prescriptions</h2>
                    <p className="text-3xl mt-2 font-bold text-orange-600">14</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Today's Sales</h2>
                    <p className="text-3xl mt-2 font-bold text-green-600">$5,320</p>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
