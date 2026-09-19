import React from 'react';
import DoctorCard from './DoctorCard';

const DoctorList = () => {
    const doctors = [
        { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', experience: 12 },
        { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurologist', experience: 8 },
        { id: 3, name: 'Dr. Emily Davis', specialty: 'Pediatrician', experience: 15 },
        { id: 4, name: 'Dr. James Wilson', specialty: 'Dermatologist', experience: 6 },
    ];

    return (
        <div className="py-10">
            <h2 className="text-3xl font-bold text-center mb-8">Our Top Specialists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4">
                {doctors.map(doc => (
                    <DoctorCard key={doc.id} doctor={doc} />
                ))}
            </div>
        </div>
    );
};

export default DoctorList;
