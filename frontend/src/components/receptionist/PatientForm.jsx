import React from 'react';

const PatientForm = () => {
    return (
        <div className="bg-white p-6 rounded shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">Register New Patient</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="First Name" className="border p-2 rounded" />
                <input placeholder="Last Name" className="border p-2 rounded" />
                <input placeholder="Date of Birth" type="date" className="border p-2 rounded" />
                <input placeholder="Contact Number" className="border p-2 rounded" />
                <textarea placeholder="Address" className="border p-2 rounded md:col-span-2" rows="2"></textarea>
                <button className="bg-green-600 text-white py-2 rounded md:col-span-2 hover:bg-green-700">Register Patient</button>
            </form>
        </div>
    );
};

export default PatientForm;
