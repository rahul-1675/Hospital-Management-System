import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, AlertTriangle } from 'lucide-react';
import { usePharmacy } from '../../../context/PharmacyContext';

const PharmacyReports = () => {
    const { recentDispenses, inventory } = usePharmacy();
    const [period, setPeriod] = useState('daily');

    // Mock calculations
    const totalDispensedValue = recentDispenses.length * 15; // Mock avg price $15
    const lowStockItems = inventory.filter(i => i.stock <= i.reorderLevel);

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.9)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--pharmacy-shadow)', border: '1px solid var(--pharmacy-border)' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', lineHeight: 1 }}>Reports & Analytics</h1>
                    <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>Operational insights and inventory trails</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--pharmacy-border)', outline: 'none', background: 'white' }}
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option value="daily">Today</option>
                        <option value="weekly">This Week</option>
                        <option value="monthly">This Month</option>
                    </select>
                    <button className="action-btn" style={{ background: 'white', border: '1px solid var(--pharmacy-border)' }}>
                        <Download size={18} /> Export
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="dashboard-grid">
                <div className="stat-card">
                    <h3 className="text-label">Total Dispensed</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>{recentDispenses.length}</div>
                    <p className="text-label" style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#166534' }}>+5% from yesterday</p>
                </div>
                <div className="stat-card">
                    <h3 className="text-label">Inventory Value Used</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>${totalDispensedValue.toFixed(2)}</div>
                    <p className="text-label" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Est. cost of goods</p>
                </div>
                <div className="stat-card">
                    <h3 className="text-label">Stock Outs Prevented</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>3</div>
                    <p className="text-label" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>via timely alerts</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--pharmacy-border)' }}>
                        <h3 className="text-lg">Dispensing Logs</h3>
                    </div>
                    <table className="inventory-table" style={{ borderRadius: 0, boxShadow: 'none' }}>
                        <thead>
                            <tr>
                                <th>Medicine</th>
                                <th>Patient</th>
                                <th>Date/Time</th>
                                <th>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDispenses.map(d => (
                                <tr key={d.id}>
                                    <td>{d.medicine}</td>
                                    <td>{d.patient}</td>
                                    <td className="text-label">{d.date}</td>
                                    <td style={{ fontWeight: 600 }}>{d.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="stat-card">
                    <h3 className="text-lg" style={{ marginBottom: '1.5rem' }}>Inventory Health</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-label">Healthy Stock</span>
                            <span style={{ fontWeight: 600, color: '#166534' }}>{inventory.length - lowStockItems.length}</span>
                        </div>
                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${((inventory.length - lowStockItems.length) / inventory.length) * 100}%`, height: '100%', background: '#10b981' }}></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                            <span className="text-label">Low Stock</span>
                            <span style={{ fontWeight: 600, color: '#ea580c' }}>{lowStockItems.length}</span>
                        </div>
                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${(lowStockItems.length / inventory.length) * 100}%`, height: '100%', background: '#f59e0b' }}></div>
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <TrendingUp size={16} /> Most Dispensed
                            </h4>
                            <ol style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: 'var(--pharmacy-text-muted)' }}>
                                <li style={{ marginBottom: '0.25rem' }}>Amoxicillin 500mg</li>
                                <li style={{ marginBottom: '0.25rem' }}>Paracetamol 500mg</li>
                                <li>Metformin 850mg</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyReports;
