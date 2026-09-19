import React from 'react';

const InvoiceCard = ({ invoice }) => {
    if (!invoice) return null;

    return (
        <div className="border p-6 rounded bg-white shadow-lg max-w-sm mx-auto my-6">
            <div className="text-center border-b pb-4 mb-4">
                <h2 className="text-xl font-bold uppercase tracking-widest">Invoice</h2>
                <p className="text-gray-500 text-sm">HMS Pharmacy</p>
                <p className="text-gray-400 text-xs">Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="mb-4">
                <p className="font-bold">Bill To:</p>
                <p>{invoice.patientName}</p>
            </div>
            <table className="w-full text-sm mb-4">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, i) => (
                        <tr key={i} className="border-b">
                            <td className="py-1">{item.name}</td>
                            <td className="text-right py-1">${item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${invoice.total}</span>
            </div>
        </div>
    );
};

export default InvoiceCard;
