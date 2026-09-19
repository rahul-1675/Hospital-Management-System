import React from 'react';

const InventoryForm = () => {
    return (
        <div className="bg-white p-6 rounded shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">Add Medicine to Inventory</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Medicine Name" className="border p-2 rounded" />
                <input placeholder="Batch Number" className="border p-2 rounded" />
                <input placeholder="Stock Quantity" type="number" className="border p-2 rounded" />
                <input placeholder="Price per Unit" type="number" className="border p-2 rounded" />
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                    <input type="date" className="border p-2 rounded w-full" />
                </div>
                <button className="bg-blue-600 text-white py-2 rounded md:col-span-2 hover:bg-blue-700">Add to Stock</button>
            </form>
        </div>
    );
};

export default InventoryForm;
