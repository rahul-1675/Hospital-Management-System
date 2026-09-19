import React, { useState } from 'react';
import { Search, Filter, Calendar, FileText, Plus, ChevronLeft, CheckCircle } from 'lucide-react';
import AddClinicalNoteModal from '../modals/AddClinicalNoteModal';
import LabReportsPanel from '../modals/LabReportsPanel';
import ScheduleFollowUpModal from '../modals/ScheduleFollowUpModal';

const initialPatients = [
    {
        id: 1001,
        name: 'Sarah Johnson',
        age: 28,
        gender: 'Female',
        lastVisit: '2023-10-15',
        condition: 'Migraine',
        type: 'Chronic',
        timeline: [
            { id: 1, date: '2023-10-15', title: 'Routine Checkup', doctor: 'Dr. Smith', details: 'Prescribed: Sumatriptan' },
            { id: 2, date: '2023-09-10', title: 'Initial Consultation', doctor: 'Dr. Smith', details: 'Reported severe headaches.' }
        ],
        labReports: [
            { id: 1, name: 'Complete Blood Count', type: 'Hematology', date: '2023-10-14', status: 'Available' },
            { id: 2, name: 'Lipid Profile', type: 'Biochemistry', date: '2023-10-14', status: 'Available' }
        ]
    },
    {
        id: 1002,
        name: 'Michael Chen',
        age: 45,
        gender: 'Male',
        lastVisit: '2023-10-10',
        condition: 'Hypertension',
        type: 'Chronic',
        timeline: [
            { id: 1, date: '2023-10-10', title: 'Follow-up', doctor: 'Dr. Smith', details: 'BP 140/90. Adjustable dosage.' }
        ]
    },
    {
        id: 1003,
        name: 'Emma Davis',
        age: 32,
        gender: 'Female',
        lastVisit: '2023-09-20',
        condition: 'Healthy',
        type: 'Recent',
        timeline: []
    },
    {
        id: 1004,
        name: 'James Wilson',
        age: 60,
        gender: 'Male',
        lastVisit: '2023-10-05',
        condition: 'Arthritis',
        type: 'Chronic',
        timeline: [
            { id: 1, date: '2023-10-05', title: 'Pain Management', doctor: 'Dr. Smith', details: 'Joint pain increased.' }
        ]
    },
    {
        id: 1005,
        name: 'Robert Brown',
        age: 50,
        gender: 'Male',
        lastVisit: '2023-10-12',
        condition: 'Fever',
        type: 'Recent',
        timeline: []
    },
    {
        id: 1006,
        name: 'Linda Taylor',
        age: 70,
        gender: 'Female',
        lastVisit: '2023-10-01',
        condition: 'Diabetes',
        type: 'Critical',
        timeline: [
            { id: 1, date: '2023-10-01', title: 'Emergency', doctor: 'Dr. Smith', details: 'High blood sugar levels.' }
        ]
    },
];

const DoctorPatients = () => {
    const [patients, setPatients] = useState(initialPatients);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    // Modal States
    const [activeModal, setActiveModal] = useState(null); // 'note', 'lab', 'schedule'
    const [toast, setToast] = useState(null);

    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm);
        const matchesFilter = filter === 'All' || p.type === filter;
        return matchesSearch && matchesFilter;
    });

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveNote = (noteData) => {
        setPatients(prev => prev.map(p => {
            if (p.id === selectedPatientId) {
                const newVisit = {
                    id: Date.now(),
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                    title: `Clinical Note - ${noteData.diagnosis}`,
                    doctor: 'Dr. Smith',
                    details: noteData.prescription ? `Prescribed: ${noteData.prescription}` : noteData.notes
                };
                return {
                    ...p,
                    timeline: [newVisit, ...p.timeline],
                    lastVisit: 'Today'
                };
            }
            return p;
        }));
        showToast('Clinical note added successfully');
    };

    const handleScheduleFollowUp = (data) => {
        setPatients(prev => prev.map(p => {
            if (p.id === selectedPatientId) {
                const newAppointment = {
                    id: Date.now(),
                    date: data.date,
                    // We render future appointments in the timeline for visibility just for this demo
                    title: `Upcoming: ${data.reason}`,
                    doctor: 'Dr. Smith',
                    details: `Scheduled for ${data.time}. ${data.notes || ''}`
                };
                // Adding to timeline as a "Future" event effectively for this UI
                return {
                    ...p,
                    timeline: [newAppointment, ...p.timeline]
                };
            }
            return p;
        }));
        showToast('Follow-up appointment scheduled');
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
                                    {patient.name.charAt(0)}
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
            </div>
        </div>
    );
};

export default DoctorPatients;
