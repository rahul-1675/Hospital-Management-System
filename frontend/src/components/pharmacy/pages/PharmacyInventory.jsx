import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { usePharmacy } from '../../../context/PharmacyContext';

const PharmacyInventory = () => {
    const { inventory } = usePharmacy();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, lowstock, outstock

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'lowstock' ? item.stock <= item.reorderLevel
                : filter === 'outstock' ? item.stock === 0
                    : true;
        return matchesSearch && matchesFilter;
    });

    const getStatus = (stock, reorder) => {
        if (stock === 0) return { label: 'Out of Stock', class: 'status-outstock' };
        if (stock <= reorder) return { label: 'Low Stock', class: 'status-lowstock' };
        return { label: 'In Stock', class: 'status-instock' };
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.9)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--pharmacy-shadow)', border: '1px solid var(--pharmacy-border)' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', lineHeight: 1 }}>Inventory Management</h1>
                    <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>Track stock levels, expiry, and reordering</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="action-btn btn-primary">
                        <Package size={18} /> Add New Medicine
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.9)', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--pharmacy-shadow)' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pharmacy-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--pharmacy-border)', outline: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--pharmacy-border)', outline: 'none', background: 'white' }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Items</option>
                    <option value="lowstock">Low Stock Only</option>
                    <option value="outstock">Out of Stock</option>
                </select>
            </div>

            {/* Table */}
            <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Medicine Name</th>
                            <th>Category</th>
                            <th>Stock Level</th>
                            <th>Reorder Level</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.length > 0 ? filteredInventory.map(item => {
                            const status = getStatus(item.stock, item.reorderLevel);
                            return (
                                <tr key={item.id}>
                                    <td>
                                        <div className="text-value">{item.name}</div>
                                        <div className="text-label" style={{ fontSize: '0.75rem' }}>ID: #{item.id}</div>
                                    </td>
                                    <td className="text-label">{item.category}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{item.stock}</div>
                                    </td>
                                    <td className="text-label">{item.reorderLevel}</td>
                                    <td className="text-label">{item.expiry}</td>
                                    <td>
                                        <span className={`status-badge ${status.class}`}>{status.label}</span>
                                    </td>
                                    <td>
                                        <button className="action-btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: '#f1f5f9' }}>Edit</button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--pharmacy-text-muted)' }}>
                                    No medicines found matching criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PharmacyInventory;
