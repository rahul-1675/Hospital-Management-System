import React from 'react';

const MedicineTable = () => {
    const medicines = [
        { id: 1, name: 'Paracetamol', stock: 500, price: '$5', expiry: '2025-12' },
        { id: 2, name: 'Amoxicillin', stock: 200, price: '$12', expiry: '2024-06' },
        { id: 3, name: 'Ibuprofen', stock: 350, price: '$8', expiry: '2025-01' },
    ];

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <h3 className="p-4 font-bold text-lg border-b">Medicine Inventory</h3>
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {medicines.map((med) => (
                        <tr key={med.id}>
                            <td className="px-6 py-4">{med.name}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs text-white ${med.stock < 100 ? 'bg-red-500' : 'bg-green-500'}`}>
                                    {med.stock}
                                </span>
                            </td>
                            <td className="px-6 py-4">{med.price}</td>
                            <td className="px-6 py-4">{med.expiry}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MedicineTable;
