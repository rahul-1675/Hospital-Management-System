import React, { useState } from 'react';
import { Pill, Activity, AlertTriangle, Package, Search } from 'lucide-react';
import { usePharmacy } from '../../../context/PharmacyContext';

const PharmacyDashboard = ({ setActiveTab }) => {
    const { stats, recentDispenses, inventory } = usePharmacy();
    const lowStockItems = inventory.filter(i => i.stock <= i.reorderLevel).slice(0, 3);

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2rem', background: 'rgba(255, 255, 255, 0.9)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--pharmacy-shadow)', border: '1px solid var(--pharmacy-border)' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', lineHeight: 1 }}>Pharmacy Store</h1>
                <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>Overview of medication inventory and dispensing operations</p>
            </header>

            {/* Stats Grid */}
            <div className="dashboard-grid">
                <div className="stat-card" onClick={() => setActiveTab('dispense')} style={{ cursor: 'pointer', borderLeft: '4px solid #0284c7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className="text-label">Pending Prescriptions</h3>
                        <div style={{ padding: '0.5rem', background: '#e0f2fe', borderRadius: '8px', color: '#0284c7' }}><Pill size={20} /></div>
                    </div>
                    <div>
                        <span className="text-lg" style={{ fontSize: '2.5rem' }}>{stats.pendingCount}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>To Process</span>
                    </div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className="text-label">Dispensed Today</h3>
                        <div style={{ padding: '0.5rem', background: '#dcfce7', borderRadius: '8px', color: '#10b981' }}><Activity size={20} /></div>
                    </div>
                    <div>
                        <span className="text-lg" style={{ fontSize: '2.5rem' }}>14</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Completed</span>
                    </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('inventory')} style={{ cursor: 'pointer', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className="text-label">Low Stock Alerts</h3>
                        <div style={{ padding: '0.5rem', background: '#fff7ed', borderRadius: '8px', color: '#f59e0b' }}><AlertTriangle size={20} /></div>
                    </div>
                    <div>
                        <span className="text-lg" style={{ fontSize: '2.5rem' }}>{stats.lowStockCount}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Items Critical</span>
                    </div>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid #64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className="text-label">Total Inventory</h3>
                        <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#64748b' }}><Package size={20} /></div>
                    </div>
                    <div>
                        <span className="text-lg" style={{ fontSize: '2.5rem' }}>{inventory.length}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Medicines</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Recent Activity */}
                <div className="stat-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--pharmacy-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="text-lg">Recent Dispenses</h3>
                        <button className="action-btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setActiveTab('dispense')}>New Dispense</button>
                    </div>
                    <table className="inventory-table" style={{ borderRadius: 0, boxShadow: 'none' }}>
                        <thead>
                            <tr>
                                <th>Medicine</th>
                                <th>Patient</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDispenses.slice(0, 5).map(item => (
                                <tr key={item.id}>
                                    <td className="text-value">{item.medicine} <span className="text-label" style={{ ml: '0.5rem' }}>x{item.qty}</span></td>
                                    <td className="text-label">{item.patient}</td>
                                    <td className="text-label">{item.date.split(',')[0]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Alerts Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="stat-card">
                        <h3 className="text-lg" style={{ marginBottom: '1rem' }}>Stock Alerts</h3>
                        {lowStockItems.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {lowStockItems.map(item => (
                                    <div key={item.id} style={{ padding: '0.75rem', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#9a3412' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#c2410c' }}>Stock: {item.stock} (Reorder: {item.reorderLevel})</div>
                                        </div>
                                        <AlertTriangle size={18} color="#ea580c" />
                                    </div>
                                ))}
                                <button className="action-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: '#f59e0b', background: '#fffbeb' }} onClick={() => setActiveTab('inventory')}>
                                    View All Inventory
                                </button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--pharmacy-text-muted)' }}>
                                <CheckCircle size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p>All stocks are healthy</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
