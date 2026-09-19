import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertCircle, Edit, Paperclip, Save, Lock, Upload, Check } from 'lucide-react';

const initialRecords = [
    {
        id: 1,
        type: 'Lab Report',
        title: 'Complete Blood Count (CBC)',
        date: '2023-10-20',
        patientName: 'Sarah Johnson',
        status: 'Pending Review',
        data: {
            'Hemoglobin': '14.2 g/dL',
            'WBC': '6.5 K/uL',
            'Platelets': '250 K/uL',
            'RBC': '4.8 M/uL'
        },
        notes: '',
        attachments: []
    },
    {
        id: 2,
        type: 'Prescription',
        title: 'Hypertension Management',
        date: '2023-10-18',
        patientName: 'Michael Chen',
        status: 'Reviewed',
        data: {
            'Medication': 'Lisinopril',
            'Dosage': '10mg',
            'Frequency': 'Once daily',
            'Duration': '30 days'
        },
        notes: 'Patient responded well to initial dosage. BP levels stable at 120/80.',
        attachments: []
    },
    {
        id: 3,
        type: 'Diagnosis',
        title: 'Initial Consultation Report',
        date: '2023-10-15',
        patientName: 'Emma Davis',
        status: 'Reviewed',
        data: {
            'Chief Complaint': 'Persistent Cough',
            'Observation': 'Clear lungs, slight throat irritation',
            'Diagnosis': 'Viral Bronchitis'
        },
        notes: 'Advised rest and hydration. Follow up in 1 week if symptoms persist.',
        attachments: []
    }
];

const DoctorMedicalRecords = () => {
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecordId, setSelectedRecordId] = useState(initialRecords[0].id);
    const [noteInput, setNoteInput] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [toast, setToast] = useState(null);

    const selectedRecord = records.find(r => r.id === selectedRecordId);

    // Sync local state when selection changes
    useEffect(() => {
        if (selectedRecord) {
            setNoteInput(selectedRecord.notes);
            setAttachments(selectedRecord.attachments || []);
        }
    }, [selectedRecordId, records]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveDraft = () => {
        setRecords(prev => prev.map(rec => {
            if (rec.id === selectedRecordId) {
                return { ...rec, notes: noteInput, attachments: attachments };
            }
            return rec;
        }));
        showToast('Draft saved successfully');
    };

    const handleMarkAsReviewed = () => {
        if (!noteInput.trim()) {
            showToast('Please add doctor notes before reviewing.', 'error');
            return;
        }

        const now = new Date();
        const timestamp = now.toLocaleString();

        setRecords(prev => prev.map(rec => {
            if (rec.id === selectedRecordId) {
                return {
                    ...rec,
                    notes: noteInput,
                    attachments: attachments,
                    status: 'Reviewed',
                    reviewedAt: timestamp,
                    reviewedBy: 'Dr. Smith (ID: DOC-001)'
                };
            }
            return rec;
        }));
        showToast('Record marked as reviewed. Editing locked.');
    };

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newAttachment = {
                id: Date.now(),
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB'
            };
            setAttachments(prev => [...prev, newAttachment]);
        }
    };

    const isReviewed = selectedRecord?.status === 'Reviewed';

    return (
        <div className="split-view-container">
            {/* Left Panel: List */}
            <div className="list-panel">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--doctor-border)' }}>
                    <h2 className="text-lg" style={{ color: 'var(--doctor-text-main)', fontWeight: 700 }}>Medical Records</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span className="status-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                            Pending: {records.filter(r => r.status === 'Pending Review').length}
                        </span>
                        <span className="status-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                            Reviewed: {records.filter(r => r.status === 'Reviewed').length}
                        </span>
                    </div>
                </div>
                <div style={{ padding: '0.75rem' }}>
                    {records.map(record => (
                        <div
                            key={record.id}
                            className={`doctor-card ${selectedRecordId === record.id ? 'active' : ''}`}
                            onClick={() => setSelectedRecordId(record.id)}
                            style={{ margin: '0 0 0.75rem 0' }}
                        >
                            <div className="doctor-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FileText size={16} color="var(--doctor-primary)" />
                                    <span className="text-value" style={{ fontSize: '0.9rem' }}>{record.type}</span>
                                </div>
                                {record.status === 'Reviewed' ?
                                    <CheckCircle size={16} color="var(--doctor-success)" /> :
                                    <AlertCircle size={16} color="var(--doctor-warning)" />
                                }
                            </div>
                            <h4 style={{ margin: '0.5rem 0', fontWeight: 600, fontSize: '1rem' }}>{record.title}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--doctor-text-muted)' }}>
                                <span>{record.patientName}</span>
                                <span>{record.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Viewer */}
            <div className="detail-panel">
                {selectedRecord ? (
                    <div className="detail-card">
                        {/* Header */}
                        <div className="detail-header" style={{ borderBottom: '1px solid var(--doctor-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--doctor-text-muted)', fontWeight: 600 }}>{selectedRecord.type}</span>
                                    {selectedRecord.status === 'Reviewed' ? (
                                        <span className="status-badge status-completed" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle size={12} /> REVIEWED
                                        </span>
                                    ) : (
                                        <span className="status-badge status-pending" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <AlertCircle size={12} /> PENDING REVIEW
                                        </span>
                                    )}
                                </div>
                                <h1 style={{ fontSize: '1.75rem', color: 'var(--doctor-text-main)', marginBottom: '0.25rem' }}>{selectedRecord.title}</h1>
                                {isReviewed && (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--doctor-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Lock size={12} /> Locked by {selectedRecord.reviewedBy} on {selectedRecord.reviewedAt}
                                    </p>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p className="text-value" style={{ fontSize: '1.1rem' }}>{selectedRecord.patientName}</p>
                                <p className="text-label">{selectedRecord.date}</p>
                            </div>
                        </div>

                        {/* Record Data - Read Only */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 className="section-title">Clinical Data</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'var(--doctor-border)', border: '1px solid var(--doctor-border)', borderRadius: '8px', overflow: 'hidden' }}>
                                {Object.entries(selectedRecord.data).map(([key, value]) => (
                                    <div key={key} style={{ background: 'white', padding: '1rem' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--doctor-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{key}</p>
                                        <p style={{ fontWeight: 600, color: 'var(--doctor-text-main)', fontSize: '1.1rem' }}>{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Doctor's Notes */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 className="section-title" style={{ margin: 0 }}>
                                    <Edit size={18} /> Doctor's Notes
                                </h3>
                                {isReviewed && <span className="status-badge status-completed" style={{ fontSize: '0.75rem' }}>Read Only</span>}
                            </div>
                            <textarea
                                className="search-input"
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder={isReviewed ? "This record has been finalized." : "Enter your clinical observations, analysis, and recommendations..."}
                                rows={6}
                                disabled={isReviewed}
                                style={{
                                    resize: 'vertical',
                                    background: isReviewed ? '#f8fafc' : 'white',
                                    color: isReviewed ? '#64748b' : 'inherit',
                                    borderColor: isReviewed ? '#e2e8f0' : 'var(--doctor-border)'
                                }}
                            />
                        </div>

                        {/* Attachments */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 className="section-title" style={{ margin: 0 }}>
                                    <Paperclip size={18} /> Attachments
                                </h3>
                                {!isReviewed && (
                                    <label className="action-btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <Upload size={14} /> Upload File
                                        <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                                    </label>
                                )}
                            </div>

                            {attachments.length === 0 ? (
                                <div style={{ border: '2px dashed var(--doctor-border)', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: 'var(--doctor-text-muted)' }}>
                                    <p>No files attached</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {attachments.map(file => (
                                        <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid var(--doctor-border)', borderRadius: '8px', background: 'var(--doctor-bg)' }}>
                                            <Paperclip size={16} color="var(--doctor-primary)" />
                                            <div style={{ overflow: 'hidden' }}>
                                                <p className="text-value" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                                                <p className="text-label" style={{ fontSize: '0.75rem' }}>{file.size}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--doctor-border)' }}>
                            {!isReviewed ? (
                                <>
                                    <button
                                        className="action-btn btn-outline"
                                        onClick={handleSaveDraft}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Save size={18} /> Save Draft
                                    </button>
                                    <button
                                        className="action-btn btn-primary"
                                        onClick={handleMarkAsReviewed}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <CheckCircle size={18} /> Mark as Reviewed
                                    </button>
                                </>
                            ) : (
                                <button className="action-btn btn-outline" disabled style={{ opacity: 0.7, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Lock size={16} /> Record Finalized
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--doctor-text-muted)' }}>
                        Select a record to view details
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
                    color: 'white',
                    padding: '1rem 1.5rem', borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    zIndex: 2000, animation: 'slideUp 0.3s ease-out'
                }}>
                    {toast.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
                    <span style={{ fontWeight: '600' }}>{toast.message}</span>
                </div>
            )}
            <style>
                {`
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default DoctorMedicalRecords;
