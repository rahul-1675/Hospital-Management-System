import React from 'react';

const DoctorStats = () => {
    const stats = [
        { label: 'Total Patients', value: '1,234', color: 'bg-blue-500' },
        { label: 'Appointments Today', value: '12', color: 'bg-green-500' },
        { label: 'Pending Reports', value: '5', color: 'bg-yellow-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className={`${stat.color} text-white p-6 rounded-lg shadow-md`}>
                    <h3 className="text-lg font-semibold">{stat.label}</h3>
                    <p className="text-3xl font-bold">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};

export default DoctorStats;
