import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, FileText, Plus, ChevronLeft, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import AddClinicalNoteModal from '../modals/AddClinicalNoteModal';
import LabReportsPanel from '../modals/LabReportsPanel';
import ScheduleFollowUpModal from '../modals/ScheduleFollowUpModal';
import { doctorService } from '../../../services/doctor.service';
import { useAuth } from '../../../hooks/useAuth';

const DoctorPatients = () => {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    // Modal States
    const [activeModal, setActiveModal] = useState(null); // 'note', 'lab', 'schedule'
    const [toast, setToast] = useState(null);

    const loadPatients = async () => {
        try {
            setLoading(true);
            const data = await doctorService.getPatients();
            setPatients(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Failed to load doctor patients:', err);
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
    }, []);

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

    if (selectedPatient) {
        return (
            <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
                <button
                    onClick={() => setSelectedPatientId(null)}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', color: 'var(--doctor-text-muted)' }}
                >
                    <ChevronLeft size={20} /> Back to Patient List
                </button>

                <div className="detail-card">
                    <div className="detail-header">
                        <div>
                            <h1 style={{ marginBottom: '0.5rem' }}>{selectedPatient.name}</h1>
                            <p className="text-label" style={{ fontSize: '1.1rem' }}>Patient ID: #{selectedPatient.id} • {selectedPatient.age} yrs • {selectedPatient.gender}</p>
                        </div>
                        <span className="status-badge status-pending" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>{selectedPatient.condition}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <div>
                            <h3 className="section-title">Visit Timeline</h3>
                            <div style={{ borderLeft: '2px solid var(--doctor-border)', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
                                {selectedPatient.timeline.length === 0 ? (
                                    <p className="text-label">No history available.</p>
                                ) : (
                                    selectedPatient.timeline.map((event, index) => (
                                        <div key={event.id} style={{ marginBottom: '2rem', position: 'relative' }}>
                                            <div style={{
                                                position: 'absolute', left: '-1.9rem', top: '0',
                                                width: '12px', height: '12px', borderRadius: '50%',
                                                background: index === 0 ? 'var(--doctor-primary)' : 'var(--doctor-border)'
                                            }}></div>
                                            <h4 className="text-value">{event.date}</h4>
                                            <p style={{ fontWeight: '500' }}>{event.title}</p>
                                            <p className="text-label">{event.details}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="section-title">Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                {/* Toast Notification */}
                {toast && (
                    <div style={{
                        position: 'fixed', top: '20px', right: '20px',
                        backgroundColor: '#10b981', color: 'white',
                        padding: '1rem 1.5rem', borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        zIndex: 2000, animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <CheckCircle size={20} />
                        <span style={{ fontWeight: '600' }}>{toast}</span>
                    </div>
                )}
                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="search-bar-container">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--doctor-text-muted)' }} />
                        <input
                            type="text"
                            className="search-input"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="Search patients by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {['All', 'Recent', 'Chronic', 'Critical'].map(level => (
                        <button
                            key={level}
                            onClick={() => setFilter(level)}
                            className={`action-btn ${filter === level ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
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
                        {filteredPatients.map(patient => (
                            <div
                                key={patient.id}
                                className="doctor-card"
                                onClick={() => setSelectedPatientId(patient.id)}
                                style={{ borderColor: patient.type === 'Critical' ? 'var(--doctor-warning)' : '' }}
                            >
                                <div className="doctor-card-header" style={{ marginBottom: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--doctor-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--doctor-primary)', fontWeight: 'bold' }}>
                                        {(patient.name || 'P').charAt(0)}
                                    </div>
                                    <span className="status-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>#{patient.id}</span>
                                </div>
                                <h3 className="text-value" style={{ fontSize: '1.1rem' }}>{patient.name}</h3>
                                <p className="text-label">{patient.age} yrs • {patient.gender}</p>
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--doctor-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p className="text-label" style={{ fontSize: '0.75rem' }}>Last Visit</p>
                                        <p className="text-value" style={{ fontSize: '0.9rem' }}>{patient.lastVisit}</p>
                                    </div>
                                    <span className={`status-badge`} style={{
                                        backgroundColor: patient.type === 'Critical' ? '#fef2f2' : '#f0f9ff',
                                        color: patient.type === 'Critical' ? '#ef4444' : '#0ea5e9'
                                    }}>
                                        {patient.condition}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPatients;
