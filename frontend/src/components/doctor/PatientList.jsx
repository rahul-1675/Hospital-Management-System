import React from 'react';
import PatientCard from './PatientCard';

const PatientList = () => {
    const patients = [
        { id: 1, name: 'Alice Williams', age: 34, gender: 'Female' },
        { id: 2, name: 'David Miller', age: 45, gender: 'Male' },
        { id: 3, name: 'Sophie Turner', age: 22, gender: 'Female' },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">My Patients</h3>
            <div className="space-y-4">
                {patients.map(p => <PatientCard key={p.id} patient={p} />)}
            </div>
        </div>
    );
};

export default PatientList;
