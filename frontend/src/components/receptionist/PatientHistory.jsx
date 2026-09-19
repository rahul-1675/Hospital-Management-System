import React from 'react';

const PatientHistory = () => {
    const history = [
        { date: '2023-10-15', doctor: 'Dr. Johnson', diagnosis: 'Flu', status: 'Recovered' },
        { date: '2023-08-01', doctor: 'Dr. Chen', diagnosis: 'Migraine', status: 'Ongoing' },
    ];

    return (
        <div className="bg-white p-6 rounded shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">Patient Medical History</h3>
            <ul className="space-y-3">
                {history.map((record, idx) => (
                    <li key={idx} className="border-b pb-2">
                        <div className="flex justify-between">
                            <span className="font-semibold">{record.date}</span>
                            <span className="text-gray-600">{record.doctor}</span>
                        </div>
                        <p className="text-sm">Diagnosis: {record.diagnosis}</p>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{record.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientHistory;
