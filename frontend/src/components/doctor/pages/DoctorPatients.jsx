import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, FileText, Plus, ChevronLeft, CheckCircle, RefreshCw, AlertCircle, UserMinus, ShieldAlert, Clock, Check, XCircle } from 'lucide-react';
import AddClinicalNoteModal from '../modals/AddClinicalNoteModal';
import LabReportsPanel from '../modals/LabReportsPanel';
import ScheduleFollowUpModal from '../modals/ScheduleFollowUpModal';
import RequestPatientRemovalModal from '../modals/RequestPatientRemovalModal';
import { doctorService } from '../../../services/doctor.service';
import { useAuth } from '../../../hooks/useAuth';

const DoctorPatients = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('patients'); // 'patients' | 'removal-requests'
    const [patients, setPatients] = useState([]);
    const [removalRequests, setRemovalRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    // Modal States
    const [activeModal, setActiveModal] = useState(null); // 'note' | 'lab' | 'schedule' | 'remove'
    const [removalTargetPatient, setRemovalTargetPatient] = useState(null);
    const [toast, setToast] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [patData, remData] = await Promise.all([
                doctorService.getPatients(),
                doctorService.getPatientRemovalRequests(user?.staffId || user?.id || 'DOC001')
            ]);
            setPatients(Array.isArray(patData) ? patData : []);
            setRemovalRequests(Array.isArray(remData) ? remData : []);
        } catch (err) {
            console.warn('Failed to load doctor patient records:', err);
            setPatients([]);
            setRemovalRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    const filteredPatients = patients.filter(p => {
        const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
            (p.id || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || p.type === filter;
        return matchesSearch && matchesFilter;
    });

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveNote = async (noteData) => {
        const doctorName = user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Attending Physician';
        const noteText = noteData.prescription ? `Prescription: ${noteData.prescription} | Notes: ${noteData.notes || ''}` : (noteData.notes || '');

        setPatients(prev => prev.map(p => {
            if (p.id === selectedPatientId) {
                const newVisit = {
                    id: Date.now().toString(),
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                    title: `Clinical Note - ${noteData.diagnosis || 'OPD Assessment'}`,
                    doctor: doctorName,
                    details: noteText
                };
                return {
                    ...p,
                    timeline: [newVisit, ...(p.timeline || [])],
                    lastVisit: 'Today'
                };
            }
            return p;
        }));

        try {
            if (selectedPatient?.id) {
                await doctorService.saveRecord(selectedPatient.id, noteText);
            }
        } catch (err) {
            console.warn('Failed to persist clinical note:', err);
        }

        showToast('Clinical note added and saved successfully');
    };

    const handleScheduleFollowUp = (data) => {
        const doctorName = user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Attending Physician';
        setPatients(prev => prev.map(p => {
            if (p.id === selectedPatientId) {
                const newAppointment = {
                    id: Date.now().toString(),
                    date: data.date,
                    title: `Follow-up: ${data.reason || 'Consultation Review'}`,
                    doctor: doctorName,
                    details: `Scheduled for ${data.time}. ${data.notes || ''}`
                };
                return {
                    ...p,
                    timeline: [newAppointment, ...(p.timeline || [])]
                };
            }
            return p;
        }));
        showToast('Follow-up appointment scheduled successfully');
    };

    const handleRequestPatientRemoval = async (data) => {
        try {
            const payload = {
                ...data,
                doctorId: user?.staffId || user?.id || 'DOC001',
                doctorName: user?.name || 'Dr. Sarah Smith'
            };
            const res = await doctorService.requestPatientRemoval(payload);
            if (res && res.success !== false) {
                showToast(`Removal request for '${data.patientName}' submitted for Admin approval`);
                loadData();
            } else {
                showToast(res.message || 'Failed to submit removal request');
            }
        } catch (err) {
            showToast('Error submitting removal request');
        }
    };

    // Check if patient has a pending removal request
    const getPatientRemovalStatus = (patient) => {
        const req = removalRequests.find(r => r.patientName?.toLowerCase() === patient.name?.toLowerCase() || r.patientId === patient.id);
        return req?.status;
    };

    if (selectedPatient) {
        const remStatus = getPatientRemovalStatus(selectedPatient);

        return (
            <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
                <button
                    onClick={() => setSelectedPatientId(null)}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', color: 'var(--doctor-text-muted)', fontWeight: 600 }}
                >
                    <ChevronLeft size={20} /> Back to Patient List
                </button>

                <div className="detail-card">
                    <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>{selectedPatient.name}</h1>
                                {remStatus === 'Pending' && (
                                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Clock size={12} /> Removal Pending Admin Approval
                                    </span>
                                )}
                            </div>
                            <p className="text-label" style={{ fontSize: '1rem', margin: '0.35rem 0 0' }}>
                                Patient ID: #{selectedPatient.id} • {selectedPatient.age} yrs • {selectedPatient.gender} • {selectedPatient.phone || 'Phone verified'}
                            </p>
                        </div>
                        <span className="status-badge" style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem', background: '#e0f2fe', color: '#0284c7', fontWeight: 700 }}>
                            {selectedPatient.condition}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <div>
                            <h3 className="section-title">Clinical Visit Timeline</h3>
                            <div style={{ borderLeft: '2px solid var(--doctor-border)', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
                                {selectedPatient.timeline.length === 0 ? (
                                    <p className="text-label">No previous history available.</p>
                                ) : (
                                    selectedPatient.timeline.map((event, index) => (
                                        <div key={event.id || index} style={{ marginBottom: '2rem', position: 'relative' }}>
                                            <div style={{
                                                position: 'absolute', left: '-1.9rem', top: '0',
                                                width: '12px', height: '12px', borderRadius: '50%',
                                                background: index === 0 ? 'var(--doctor-primary)' : 'var(--doctor-border)'
                                            }}></div>
                                            <h4 className="text-value" style={{ margin: 0 }}>{event.date}</h4>
                                            <p style={{ fontWeight: '700', margin: '0.2rem 0', color: '#0f172a' }}>{event.title}</p>
                                            <p className="text-label" style={{ margin: 0 }}>{event.details}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="section-title">Clinical Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <button
                                    onClick={() => setActiveModal('note')}
                                    className="action-btn btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                                >
                                    <Plus size={18} /> Add Clinical Note
                                </button>
                                <button
                                    onClick={() => setActiveModal('lab')}
                                    className="action-btn btn-outline"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                                >
                                    <FileText size={18} /> View Lab Reports
                                </button>
                                <button
                                    onClick={() => setActiveModal('schedule')}
                                    className="action-btn btn-outline"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                                >
                                    <Calendar size={18} /> Schedule Follow-up
                                </button>

                                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '1rem', paddingTop: '1rem' }}>
                                    <button
                                        disabled={remStatus === 'Pending'}
                                        onClick={() => {
                                            setRemovalTargetPatient(selectedPatient);
                                            setActiveModal('remove');
                                        }}
                                        className="action-btn btn-outline"
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            justifyContent: 'center',
                                            color: remStatus === 'Pending' ? '#94a3b8' : '#dc2626',
                                            borderColor: remStatus === 'Pending' ? '#e2e8f0' : '#fca5a5',
                                            background: remStatus === 'Pending' ? '#f8fafc' : '#fff5f5'
                                        }}
                                    >
                                        <UserMinus size={18} />
                                        {remStatus === 'Pending' ? 'Removal Request Pending Admin' : 'Request Patient Discharge / Removal'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <AddClinicalNoteModal
                    isOpen={activeModal === 'note'}
                    onClose={() => setActiveModal(null)}
                    patientName={selectedPatient.name}
                    onSave={handleSaveNote}
                />
                <LabReportsPanel
                    isOpen={activeModal === 'lab'}
                    onClose={() => setActiveModal(null)}
                    patientName={selectedPatient.name}
                    reports={selectedPatient.labReports || []}
                />
                <ScheduleFollowUpModal
                    isOpen={activeModal === 'schedule'}
                    onClose={() => setActiveModal(null)}
                    patientName={selectedPatient.name}
                    onConfirm={handleScheduleFollowUp}
                />
                <RequestPatientRemovalModal
                    isOpen={activeModal === 'remove'}
                    onClose={() => {
                        setActiveModal(null);
                        setRemovalTargetPatient(null);
                    }}
                    patient={removalTargetPatient || selectedPatient}
                    onSubmit={handleRequestPatientRemoval}
                />

                {/* Toast Notification */}
                {toast && (
                    <div style={{
                        position: 'fixed', top: '24px', right: '24px',
                        backgroundColor: '#0f172a', color: 'white',
                        padding: '0.85rem 1.4rem', borderRadius: '10px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        zIndex: 9999, fontWeight: 600, fontSize: '0.9rem'
                    }}>
                        <CheckCircle size={18} color="#10b981" />
                        <span>{toast}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="search-bar-container" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setActiveTab('patients')}
                            className="action-btn"
                            style={{
                                background: activeTab === 'patients' ? '#0284c7' : '#ffffff',
                                color: activeTab === 'patients' ? '#ffffff' : '#334155',
                                border: '1px solid',
                                borderColor: activeTab === 'patients' ? '#0284c7' : '#cbd5e1',
                                fontWeight: 700,
                                padding: '0.6rem 1.1rem',
                                borderRadius: '8px'
                            }}
                        >
                            Active Patients ({patients.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('removal-requests')}
                            className="action-btn"
                            style={{
                                background: activeTab === 'removal-requests' ? '#0284c7' : '#ffffff',
                                color: activeTab === 'removal-requests' ? '#ffffff' : '#334155',
                                border: '1px solid',
                                borderColor: activeTab === 'removal-requests' ? '#0284c7' : '#cbd5e1',
                                fontWeight: 700,
                                padding: '0.6rem 1.1rem',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            <ShieldAlert size={16} color={activeTab === 'removal-requests' ? '#ffffff' : '#d97706'} />
                            Removal Requests
                            {removalRequests.filter(r => r.status === 'Pending').length > 0 && (
                                <span style={{
                                    background: activeTab === 'removal-requests' ? '#ffffff' : '#d97706',
                                    color: activeTab === 'removal-requests' ? '#0284c7' : '#ffffff',
                                    padding: '0.1rem 0.5rem',
                                    borderRadius: '99px',
                                    fontSize: '0.72rem',
                                    fontWeight: 800
                                }}>
                                    {removalRequests.filter(r => r.status === 'Pending').length}
                                </span>
                            )}
                        </button>
                    </div>

                    <button
                        className="action-btn btn-outline"
                        onClick={loadData}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.9rem' }}
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                </div>

                {activeTab === 'patients' && (
                    <>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--doctor-text-muted)' }} />
                                <input
                                    type="text"
                                    className="search-input"
                                    style={{ paddingLeft: '2.75rem', borderRadius: '10px' }}
                                    placeholder="Search patients by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['All', 'Recent', 'Chronic', 'Critical'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setFilter(level)}
                                    className={`action-btn ${filter === level ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', borderRadius: '8px' }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                {activeTab === 'removal-requests' ? (
                    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                                Doctor-Initiated Patient Removal Requests
                            </h2>
                            <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                                Track patient discharge and removal requests submitted for Hospital Administrator review.
                            </p>
                        </div>

                        {removalRequests.length === 0 ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                <UserMinus size={40} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>No Patient Removal Requests</h4>
                                <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem' }}>When you request to remove or discharge a patient, the request status will appear here.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {removalRequests.map(req => {
                                    const isPending = req.status === 'Pending';
                                    const isApproved = req.status === 'Approved';
                                    const isRejected = req.status === 'Rejected';

                                    return (
                                        <div
                                            key={req._id || req.id}
                                            style={{
                                                background: '#ffffff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '14px',
                                                padding: '1.25rem 1.5rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '1rem'
                                            }}
                                        >
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                                        {req.patientName}
                                                    </h4>
                                                    <span style={{
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: '99px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        background: isPending ? '#fef3c7' : isApproved ? '#dcfce7' : '#fee2e2',
                                                        color: isPending ? '#92400e' : isApproved ? '#166534' : '#991b1b',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}>
                                                        {isPending ? <Clock size={12} /> : isApproved ? <Check size={12} /> : <XCircle size={12} />}
                                                        {req.status}
                                                    </span>
                                                </div>
                                                <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#475569' }}>
                                                    <strong>Reason:</strong> {req.reason} {req.notes && `• "${req.notes}"`}
                                                </p>
                                                {req.adminNote && (
                                                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#0284c7', fontWeight: 600 }}>
                                                        Admin Note: {req.adminNote}
                                                    </p>
                                                )}
                                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                                                    Requested: {req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : 'Recently'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', color: 'var(--doctor-text-muted)' }}>
                        <RefreshCw size={32} className="spin" />
                        <p>Loading patient clinical records...</p>
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', color: 'var(--doctor-text-muted)' }}>
                        <AlertCircle size={40} />
                        <h3>No patients found</h3>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>No registered patient records match your current filter.</p>
                    </div>
                ) : (
                    <div className="patient-grid">
                        {filteredPatients.map(patient => {
                            const remStatus = getPatientRemovalStatus(patient);

                            return (
                                <div
                                    key={patient.id}
                                    className="doctor-card"
                                    onClick={() => setSelectedPatientId(patient.id)}
                                    style={{
                                        background: '#ffffff',
                                        borderColor: remStatus === 'Pending' ? '#f59e0b' : patient.type === 'Critical' ? 'var(--doctor-warning)' : '#e2e8f0',
                                        position: 'relative'
                                    }}
                                >
                                    <div className="doctor-card-header" style={{ marginBottom: '0.75rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--doctor-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--doctor-primary)', fontWeight: 'bold' }}>
                                            {(patient.name || 'P').charAt(0)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                            {remStatus === 'Pending' && (
                                                <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '99px' }}>
                                                    Removal Pending
                                                </span>
                                            )}
                                            <span className="status-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>#{patient.id}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-value" style={{ fontSize: '1.1rem', margin: '0 0 0.2rem' }}>{patient.name}</h3>
                                    <p className="text-label" style={{ margin: 0 }}>{patient.age} yrs • {patient.gender}</p>
                                    <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--doctor-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p className="text-label" style={{ fontSize: '0.75rem', margin: 0 }}>Last Visit</p>
                                            <p className="text-value" style={{ fontSize: '0.88rem', margin: 0 }}>{patient.lastVisit}</p>
                                        </div>
                                        <span className="status-badge" style={{
                                            backgroundColor: patient.type === 'Critical' ? '#fef2f2' : '#f0f9ff',
                                            color: patient.type === 'Critical' ? '#ef4444' : '#0ea5e9'
                                        }}>
                                            {patient.condition}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <RequestPatientRemovalModal
                isOpen={activeModal === 'remove'}
                onClose={() => {
                    setActiveModal(null);
                    setRemovalTargetPatient(null);
                }}
                patient={removalTargetPatient}
                onSubmit={handleRequestPatientRemoval}
            />

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '24px', right: '24px',
                    backgroundColor: '#0f172a', color: 'white',
                    padding: '0.85rem 1.4rem', borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    zIndex: 9999, fontWeight: 600, fontSize: '0.9rem'
                }}>
                    <CheckCircle size={18} color="#10b981" />
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default DoctorPatients;
