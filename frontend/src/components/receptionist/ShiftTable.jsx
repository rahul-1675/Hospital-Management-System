import React from 'react';

const ShiftTable = () => {
    const shifts = [
        { doctor: 'Dr. Sarah Johnson', day: 'Monday', time: '09:00 - 17:00' },
        { doctor: 'Dr. Michael Chen', day: 'Tuesday', time: '10:00 - 18:00' },
        { doctor: 'Dr. Emily Davis', day: 'Wednesday', time: '08:00 - 16:00' },
    ];

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden my-6">
            <h3 className="text-lg font-bold p-4 border-b">Doctor Shifts</h3>
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {shifts.map((shift, idx) => (
                        <tr key={idx}>
                            <td className="px-6 py-4">{shift.doctor}</td>
                            <td className="px-6 py-4">{shift.day}</td>
                            <td className="px-6 py-4">{shift.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShiftTable;
