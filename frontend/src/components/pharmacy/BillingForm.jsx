import React from 'react';

const BillingForm = () => {
    return (
        <div className="bg-white p-6 rounded shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">Generate Bill</h3>
            <div className="space-y-4">
                <input placeholder="Patient ID / Name" className="border p-2 rounded w-full" />
                <div className="p-4 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-500 mb-2">Selected Medicines:</p>
                    {/* Placeholder for dynamic list */}
                    <p className="text-gray-400 italic">No medicines selected</p>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>$0.00</span>
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Print Invoice</button>
            </div>
        </div>
    );
};

export default BillingForm;
