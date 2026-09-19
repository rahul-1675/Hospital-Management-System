import React from 'react';

const AppointmentTable = () => {
    const appointments = [
        { id: 1, patient: 'John Doe', time: '10:00 AM', type: 'Checkup', status: 'Confirmed' },
        { id: 2, patient: 'Jane Smith', time: '11:00 AM', type: 'Follow-up', status: 'Pending' },
        { id: 3, patient: 'Robert Brown', time: '02:00 PM', type: 'Checkup', status: 'Confirmed' },
    ];

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((apt) => (
                        <tr key={apt.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{apt.patient}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{apt.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{apt.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {apt.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">View</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentTable;
