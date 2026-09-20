import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, RotateCcw, Download, Printer, RefreshCw } from 'lucide-react';

const AdminFinance = () => {
    const { invoices, markInvoicePaid, refundInvoice } = useAdmin();
    const [refundId, setRefundId] = useState(null);
    const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState(null);

    // Compute dynamic financial KPIs from live invoice records
    const paidInvoices = invoices.filter(inv => (inv.status || '').toLowerCase() === 'paid' || (inv.status || '') === 'Pd');
    const pendingInvoices = invoices.filter(inv => (inv.status || '').toLowerCase() === 'pending' || (inv.status || '').toLowerCase() === 'overdue');
    
    const totalCollected = paidInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

    const handleRefundConfirm = () => {
        if (refundId) {
            refundInvoice(refundId);
            setRefundId(null);
        }
    };

    const handlePrintReceipt = (inv) => {
        setSelectedInvoiceForReceipt(inv);
    };

    return (
        <div style={{ padding: '2.5rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                        Financial Overview
                    </h1>
                    <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>
                        Real-time revenue tracking, patient consultation billing, and receipt issuance.
                    </p>
                </div>
            </header>

            {/* Dynamic Financial KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Settled Revenue</span>
                        <div style={{ padding: '0.45rem', borderRadius: '8px', background: '#ecfdf5', color: '#10b981' }}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                        ${totalCollected.toLocaleString()}
                    </span>
                    <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 700 }}>
                        {paidInvoices.length} Paid Invoices
                    </span>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Pending Payments</span>
                        <div style={{ padding: '0.45rem', borderRadius: '8px', background: '#fffbeb', color: '#d97706' }}>
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                        ${pendingAmount.toLocaleString()}
                    </span>
                    <span style={{ color: '#d97706', fontSize: '0.82rem', fontWeight: 700 }}>
                        {pendingInvoices.length} Outstanding Invoices
                    </span>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Total Transactions</span>
                        <div style={{ padding: '0.45rem', borderRadius: '8px', background: '#eff6ff', color: '#0284c7' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                        {invoices.length}
                    </span>
                    <span style={{ color: '#0284c7', fontSize: '0.82rem', fontWeight: 700 }}>
                        All billable visits & orders
                    </span>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Collection Rate</span>
                        <div style={{ padding: '0.45rem', borderRadius: '8px', background: '#ecfdf5', color: '#10b981' }}>
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                        {invoices.length > 0 ? `${Math.round((paidInvoices.length / invoices.length) * 100)}%` : '100%'}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                        Fulfilled payments
                    </span>
                </div>
            </div>

            {/* Real Invoice List Table */}
            <div className="detail-card" style={{ padding: 0, overflow: 'hidden', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        Hospital Patient Invoices & Billing
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        Showing {invoices.length} records
                    </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Invoice Ref</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Patient Name</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length > 0 ? (
                            invoices.map(inv => {
                                const isPaid = (inv.status || '').toLowerCase() === 'paid' || inv.status === 'Pd';
                                const isRefunded = (inv.status || '').toLowerCase() === 'refunded';

                                return (
                                    <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.92rem' }}>
                                        <td style={{ padding: '1.1rem 1.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                                            {inv.id}
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem', color: '#64748b' }}>
                                            {inv.date}
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem', fontWeight: 700, color: '#0f172a' }}>
                                            {inv.patient}
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem', fontWeight: 800, color: '#0f172a' }}>
                                            ${Number(inv.amount || 0).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                                                background: isPaid ? '#ecfdf5' : isRefunded ? '#fef2f2' : '#fffbeb',
                                                color: isPaid ? '#059669' : isRefunded ? '#b91c1c' : '#d97706',
                                                border: `1px solid ${isPaid ? '#a7f3d0' : isRefunded ? '#fecaca' : '#fde68a'}`
                                            }}>
                                                {isPaid ? 'PAID' : isRefunded ? 'REFUNDED' : 'PENDING'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <button
                                                    className="btn-ghost"
                                                    title="View & Print Official Receipt"
                                                    style={{ color: '#0284c7', padding: '0.4rem', cursor: 'pointer' }}
                                                    onClick={() => handlePrintReceipt(inv)}
                                                >
                                                    <Printer size={18} />
                                                </button>

                                                {!isPaid && !isRefunded && (
                                                    <button
                                                        className="action-btn btn-primary"
                                                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}
                                                        onClick={() => markInvoicePaid(inv.id)}
                                                    >
                                                        <CheckCircle size={14} /> Pay
                                                    </button>
                                                )}
                                                {isPaid && (
                                                    <button
                                                        className="action-btn btn-outline"
                                                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: '#fca5a5', color: '#ef4444' }}
                                                        onClick={() => setRefundId(inv.id)}
                                                    >
                                                        <RotateCcw size={14} /> Refund
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                    No billing invoices available yet. Invoices generate automatically upon patient appointment bookings.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Printable Receipt Modal */}
            {selectedInvoiceForReceipt && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)',
                    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }} onClick={() => setSelectedInvoiceForReceipt(null)}>
                    <div className="detail-card" style={{ width: '480px', padding: '2.25rem', borderRadius: '20px', background: '#ffffff' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                                ProHealth Hospital
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Official Clinical Service Receipt</p>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Invoice Ref: {selectedInvoiceForReceipt.id}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Date:</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedInvoiceForReceipt.date}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Patient Name:</span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedInvoiceForReceipt.patient}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Department:</span>
                                <span style={{ fontWeight: 600, color: '#0284c7' }}>General Consultation</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                                <span style={{ fontWeight: 800, color: '#0f172a' }}>Total Amount:</span>
                                <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.1rem' }}>
                                    ${Number(selectedInvoiceForReceipt.amount || 0).toFixed(2)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Status:</span>
                                <span style={{ fontWeight: 700, color: (selectedInvoiceForReceipt.status || '').toLowerCase() === 'paid' ? '#059669' : '#d97706' }}>
                                    {(selectedInvoiceForReceipt.status || 'PENDING').toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => window.print()}
                                className="action-btn btn-primary"
                                style={{ flex: 1, justifyContent: 'center', padding: '0.65rem', fontWeight: 700 }}
                            >
                                <Printer size={16} /> Print Receipt
                            </button>
                            <button
                                onClick={() => setSelectedInvoiceForReceipt(null)}
                                className="action-btn btn-outline"
                                style={{ flex: 1, justifyContent: 'center', padding: '0.65rem' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Confirmation Modal */}
            {refundId && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)',
                    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div className="detail-card" style={{ width: '420px', padding: '2rem', borderRadius: '20px', background: '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: '#fffbeb', borderRadius: '50%', color: '#d97706' }}>
                                <AlertCircle size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Issue Patient Refund?</h2>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                            Are you sure you want to issue a full refund for invoice <strong>{refundId}</strong>? This will reverse the transaction and update the appointment record.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="action-btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setRefundId(null)}>Cancel</button>
                            <button className="action-btn" style={{ flex: 1, background: '#d97706', color: 'white', justifyContent: 'center', border: 'none', fontWeight: 700 }} onClick={handleRefundConfirm}>Confirm Refund</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFinance;

