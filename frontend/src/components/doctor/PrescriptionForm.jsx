import React, { useState } from 'react';

const PrescriptionForm = () => {
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '' }]);

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '' }]);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">Write Prescription</h3>
            <div className="space-y-4">
                {medicines.map((med, index) => (
                    <div key={index} className="flex space-x-2">
                        <input placeholder="Medicine Name" className="border p-2 rounded w-1/3" />
                        <input placeholder="Dosage (e.g., 500mg)" className="border p-2 rounded w-1/3" />
                        <input placeholder="Frequency (e.g., 1-0-1)" className="border p-2 rounded w-1/3" />
                    </div>
                ))}
            </div>
            <div className="mt-4 flex space-x-4">
                <button onClick={addMedicine} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    + Add Medicine
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Save Prescription
                </button>
            </div>
        </div>
    );
};

export default PrescriptionForm;
