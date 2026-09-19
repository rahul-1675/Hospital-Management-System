import React from 'react';
import { X, FileText, Download, Eye, AlertCircle } from 'lucide-react';

const LabReportsPanel = ({ isOpen, onClose, patientName, reports = [] }) => {

    if (!isOpen) return null;

    const handleDownload = (reportName) => {
        // UI-level only
        alert(`Downloading ${reportName}...`);
    };

    const handleView = (reportName) => {
        alert(`Opening ${reportName}...`);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '16px',
                width: '700px', maxWidth: '95%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'slideIn 0.3s ease-out'
            }}>
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid var(--doctor-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--doctor-text-main)' }}>Lab Reports</h2>
                        <p className="text-label">For patient: {patientName}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--doctor-text-muted)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                    {reports.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--doctor-text-muted)' }}>
                            <FileText size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                            <p>No lab reports found for this patient.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {reports.map(report => (
                                <div key={report.id} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '1rem', border: '1px solid var(--doctor-border)', borderRadius: '12px',
                                    backgroundColor: 'var(--doctor-bg)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '8px',
                                            backgroundColor: 'white', border: '1px solid var(--doctor-border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--doctor-primary)'
                                        }}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: '600', color: 'var(--doctor-text-main)', margin: 0 }}>{report.name}</h4>
                                            <p className="text-label" style={{ margin: 0 }}>{report.type} • {report.date}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span className={`status-badge ${report.status === 'Available' ? 'status-completed' : 'status-pending'}`}>
                                            {report.status}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleView(report.name)}
                                                className="action-btn btn-outline"
                                                style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
                                                title="View Report"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(report.name)}
                                                className="action-btn btn-primary"
                                                style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
                                                disabled={report.status !== 'Available'}
                                                title="Download PDF"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                        <AlertCircle size={20} style={{ color: 'var(--doctor-primary)', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                            These reports are read-only to ensure data integrity. To request corrections, please contact the pathology department.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabReportsPanel;
