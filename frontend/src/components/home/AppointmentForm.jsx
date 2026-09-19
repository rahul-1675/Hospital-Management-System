import React, { useState } from 'react';

const AppointmentForm = () => {
    const [appointment, setAppointment] = useState({
        patientName: '',
        date: '',
        time: '',
        department: '',
        notes: ''
    });

    const handleChange = (e) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Appointment Request:', appointment);
        alert('Appointment request submitted!');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto my-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Book an Appointment</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-gray-700 mb-2">Patient Name</label>
                    <input type="text" name="patientName" onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Date</label>
                        <input type="date" name="date" onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Time</label>
                        <input type="time" name="time" onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Department</label>
                    <select name="department" onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="">Select Department</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Notes</label>
                    <textarea name="notes" rows="3" onChange={handleChange} className="w-full border p-2 rounded"></textarea>
                </div>
                <button type="submit" className="bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">Submit Request</button>
            </form>
        </div>
    );
};

export default AppointmentForm;
