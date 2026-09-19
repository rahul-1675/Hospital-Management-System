import React from 'react';

const DoctorAvailability = () => {
    const availability = [
        { name: 'Dr. Johnson', status: 'Available', room: '101' },
        { name: 'Dr. Chen', status: 'In Surgery', room: 'OT-2' },
        { name: 'Dr. Davis', status: 'On Break', room: 'Staff Room' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {availability.map((doc, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                    <h4 className="font-bold text-lg">{doc.name}</h4>
                    <p className={`text-sm font-semibold ${doc.status === 'Available' ? 'text-green-600' : 'text-red-500'}`}>
                        {doc.status}
                    </p>
                    <p className="text-xs text-gray-500">Location: {doc.room}</p>
                </div>
            ))}
        </div>
    );
};

export default DoctorAvailability;
