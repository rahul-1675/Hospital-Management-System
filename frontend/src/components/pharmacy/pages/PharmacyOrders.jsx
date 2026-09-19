import React, { useState } from 'react';
import { ClipboardList, PlusCircle, CheckCircle, Truck, Package, X } from 'lucide-react';
import { usePharmacy } from '../../../context/PharmacyContext';

const PharmacyOrders = () => {
    const { orders, inventory, createOrder, receiveOrder } = usePharmacy();
    const [showNewOrder, setShowNewOrder] = useState(false);

    // New Order Form State
    const [supplier, setSupplier] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentItemId, setCurrentItemId] = useState('');
    const [currentItemQty, setCurrentItemQty] = useState(1);

    const handleAddItem = () => {
        if (!currentItemId || currentItemQty <= 0) return;
        const med = inventory.find(i => i.id === parseInt(currentItemId));
        if (med) {
            setSelectedItems([...selectedItems, { medicineId: med.id, name: med.name, qty: parseInt(currentItemQty) }]);
            setCurrentItemId('');
            setCurrentItemQty(1);
        }
    };

    const handleRemoveItem = (index) => {
        setSelectedItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitOrder = () => {
        if (!supplier || selectedItems.length === 0) return;
        createOrder({
            supplier,
            items: selectedItems,
            totalCost: selectedItems.length * 100 // Mock cost calculation
        });
        setShowNewOrder(false);
        setSupplier('');
        setSelectedItems([]);
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.9)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--pharmacy-shadow)', border: '1px solid var(--pharmacy-border)' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', lineHeight: 1 }}>Purchase Orders</h1>
                    <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>Manage procurement and stock replenishment</p>
                </div>
                <button
                    className="action-btn btn-primary"
                    onClick={() => setShowNewOrder(true)}
                >
                    <PlusCircle size={18} /> New Order
                </button>
            </header>

            {/* Orders List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {orders.map(order => (
                    <div key={order.id} className="stat-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', border: '1px solid var(--pharmacy-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        {/* Card Header */}
                        <div style={{ padding: '1.25rem', background: 'white', borderBottom: '1px solid var(--pharmacy-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--pharmacy-text-main)', marginBottom: '0.25rem' }}>{order.supplier}</h3>
                                <p className="text-label" style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{order.id}</p>
                            </div>
                            <span
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    background: order.status === 'Received' ? '#dcfce7' : '#fff7ed',
                                    color: order.status === 'Received' ? '#166534' : '#ca8a04',
                                    border: `1px solid ${order.status === 'Received' ? '#bbf7d0' : '#fed7aa'}`
                                }}
                            >
                                {order.status}
                            </span>
                        </div>

                        {/* Order Items */}
                        <div style={{ flex: 1, padding: '1.25rem', background: '#f8fafc' }}>
                            <p className="text-label" style={{ marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Items Ordered</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'white', borderRadius: '6px', border: '1px solid var(--pharmacy-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '24px', height: '24px', background: '#e0f2fe', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                                                <Package size={14} />
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</span>
                                        </div>
                                        <span style={{ fontWeight: 600, color: 'var(--pharmacy-text-main)', background: '#f1f5f9', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>x{item.qty}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div style={{ padding: '1rem 1.25rem', background: 'white', borderTop: '1px solid var(--pharmacy-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="text-label" style={{ fontSize: '0.75rem' }}>Order Date</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{order.date}</span>
                            </div>

                            {order.status === 'Pending' ? (
                                <button
                                    className="action-btn"
                                    style={{ background: '#0284c7', color: 'white', padding: '0.6rem 1rem', fontSize: '0.875rem' }}
                                    onClick={() => receiveOrder(order.id)}
                                >
                                    <Truck size={16} /> Mark Received
                                </button>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', background: '#f0fdf4', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                                    <CheckCircle size={16} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Stock Updated</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* New Order Modal */}
            {showNewOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 className="text-lg">Create New Purchase Order</h2>
                            <button onClick={() => setShowNewOrder(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Supplier Name</label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--pharmacy-border)' }}
                                placeholder="Enter supplier name"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                            <h4 className="text-label" style={{ marginBottom: '1rem' }}>Add Medicines</h4>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <select
                                    style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--pharmacy-border)' }}
                                    value={currentItemId}
                                    onChange={(e) => setCurrentItemId(e.target.value)}
                                >
                                    <option value="">Select Medicine</option>
                                    {inventory.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    style={{ width: '80px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--pharmacy-border)' }}
                                    value={currentItemQty}
                                    onChange={(e) => setCurrentItemQty(e.target.value)}
                                />
                                <button className="action-btn" style={{ background: '#e0f2fe', color: '#0284c7' }} onClick={handleAddItem}>Add</button>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {selectedItems.map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
                                        <span>{item.name}</span>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 600 }}>x{item.qty}</span>
                                            <button onClick={() => handleRemoveItem(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} /></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="action-btn" onClick={() => setShowNewOrder(false)}>Cancel</button>
                            <button className="action-btn btn-primary" onClick={handleSubmitOrder} disabled={!supplier || selectedItems.length === 0}>Create Order</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacyOrders;
