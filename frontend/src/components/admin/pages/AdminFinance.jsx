import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { DollarSign, CreditCard, TrendingUp, AlertCircle, FileText, CheckCircle, RotateCcw, Download } from 'lucide-react';

const AdminFinance = () => {
    const { invoices, markInvoicePaid, refundInvoice } = useAdmin();
    const [refundId, setRefundId] = useState(null);

    const handleRefundConfirm = () => {
        if (refundId) {
            refundInvoice(refundId);
            setRefundId(null);
        }
    };

    return (
        <div style={{ padding: '2.5rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#000080', marginBottom: '0.5rem' }}>Financial Overview</h1>
                <p className="text-label" style={{ fontSize: '1.1rem', color: '#000080' }}>Revenue tracking and invoice management.</p>
            </header>

            {/* Financial KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-label">Today's Revenue</span>
                        <TrendingUp size={20} color="#10b981" />
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#000080' }}>$12,450</span>
                    <span className="text-label" style={{ color: '#10b981', fontSize: '0.85rem' }}>+12% vs yesterday</span>
                </div>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-label">Monthly Revenue</span>
                        <DollarSign size={20} color="#2563eb" />
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#000080' }}>$420.5k</span>
                    <span className="text-label" style={{ color: '#2563eb', fontSize: '0.85rem' }}>On track for target</span>
                </div>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-label">Pending Payments</span>
                        <AlertCircle size={20} color="#d97706" />
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#000080' }}>$45.2k</span>
                    <span className="text-label" style={{ color: '#d97706', fontSize: '0.85rem' }}>12 Invoices</span>
                </div>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-label">Completed</span>
                        <CheckCircle size={20} color="#10b981" />
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#000080' }}>1,204</span>
                    <span className="text-label" style={{ fontSize: '0.85rem' }}>Transactions this month</span>
                </div>
            </div>

            {/* Invoice List */}
            <div className="detail-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#000080' }}>Recent Invoices</h3>
                    <button className="action-btn btn-outline" style={{ fontSize: '0.875rem' }}>View All Invoices</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Invoice ID</th>
                            <th style={{ padding: '1rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                            <th style={{ padding: '1rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Patient</th>
                            <th style={{ padding: '1rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                            <th style={{ padding: '1rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '1rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem 2rem', fontFamily: 'monospace', fontWeight: 600 }}>{inv.id}</td>
                                <td style={{ padding: '1rem 2rem', color: '#64748b' }}>{inv.date}</td>
                                <td style={{ padding: '1rem 2rem', fontWeight: 600 }}>{inv.patient}</td>
                                <td style={{ padding: '1rem 2rem', fontWeight: 700 }}>${inv.amount.toFixed(2)}</td>
                                <td style={{ padding: '1rem 2rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                                        background: inv.status === 'Pd' ? '#f0fdf4' : inv.status === 'Pending' ? '#fff7ed' : inv.status === 'Overdue' ? '#fef2f2' : '#f1f5f9',
                                        color: inv.status === 'Pd' ? '#16a34a' : inv.status === 'Pending' ? '#d97706' : inv.status === 'Overdue' ? '#ef4444' : '#64748b'
                                    }}>
                                        {inv.status === 'Pd' ? 'PAID' : inv.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 2rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button className="btn-ghost" title="Download PDF" style={{ color: '#1e293b' }}>
                                            <Download size={18} />
                                        </button>
                                        {inv.status !== 'Pd' && inv.status !== 'Refunded' && (
                                            <button
                                                className="action-btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                onClick={() => markInvoicePaid(inv.id)}
                                            >
                                                <CheckCircle size={14} /> Pay
                                            </button>
                                        )}
                                        {inv.status === 'Pd' && (
                                            <button
                                                className="action-btn btn-outline"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: '#fca5a5', color: '#ef4444' }}
                                                onClick={() => setRefundId(inv.id)}
                                            >
                                                <RotateCcw size={14} /> Refund
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Refund Confirmation Modal */}
            {refundId && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div className="detail-card" style={{ width: '400px', padding: '2rem', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: '#fffbeb', borderRadius: '50%', color: '#d97706' }}>
                                <AlertCircle size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Confirm Refund?</h2>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                            Are you sure you want to issue a refund for this invoice? This will reverse the payment transaction.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="action-btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setRefundId(null)}>Cancel</button>
                            <button className="action-btn" style={{ flex: 1, background: '#d97706', color: 'white', justifyContent: 'center', border: 'none' }} onClick={handleRefundConfirm}>Issue Refund</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFinance;
