import React from 'react';

const PrescriptionList = () => {
    const prescriptions = [
        { id: 101, patient: 'John Doe', doctor: 'Dr. Johnson', status: 'Pending' },
        { id: 102, patient: 'Alice Williams', doctor: 'Dr. Chen', status: 'Dispensed' },
    ];

    return (
        <div className="bg-white p-6 rounded shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">Patient Prescriptions</h3>
            <ul className="space-y-4">
                {prescriptions.map((script) => (
                    <li key={script.id} className="border p-4 rounded flex justify-between items-center">
                        <div>
                            <p className="font-bold">Prescription #{script.id}</p>
                            <p className="text-gray-600 text-sm">Patient: {script.patient}</p>
                            <p className="text-gray-600 text-sm">Doctor: {script.doctor}</p>
                        </div>
                        <div>
                            <span className={`px-3 py-1 rounded-full text-xs ${script.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                {script.status}
                            </span>
                            {script.status === 'Pending' && (
                                <button className="ml-4 bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">
                                    Dispense
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PrescriptionList;
