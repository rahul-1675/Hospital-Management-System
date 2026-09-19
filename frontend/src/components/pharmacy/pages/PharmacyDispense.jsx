import React, { useState } from 'react';
import { Pill, CheckCircle, AlertCircle, ShoppingBag, Clock } from 'lucide-react';
import { usePharmacy } from '../../../context/PharmacyContext';

const PharmacyDispense = () => {
    const { prescriptions, inventory, dispensePrescription } = usePharmacy();
    const [selectedId, setSelectedId] = useState(null);

    const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
    const selectedPrescription = prescriptions.find(p => p.id === selectedId);

    // Helper to check stock status items
    const checkStock = (medicineId, qty) => {
        const item = inventory.find(i => i.id === medicineId);
        if (!item) return { available: false, stock: 0 };
        return { available: item.stock >= qty, stock: item.stock };
    };

    const handleDispense = () => {
        if (selectedId) dispensePrescription(selectedId);
    };

    return (
        <div className="split-view">
            {/* Sidebar List */}
            <div className="list-panel">
                <header style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--pharmacy-border)' }}>
                    <h2 className="text-lg">Pending Dispense</h2>
                    <p className="text-label">{pendingPrescriptions.length} prescriptions waiting</p>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {pendingPrescriptions.length > 0 ? pendingPrescriptions.map(p => (
                        <div
                            key={p.id}
                            className={`prescription-card ${selectedId === p.id ? 'active' : ''}`}
                            onClick={() => setSelectedId(p.id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600, color: 'var(--pharmacy-text-main)' }}>{p.id}</span>
                                <span className="text-label">{p.date}</span>
                            </div>
                            <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{p.patientName}</div>
                            <div className="text-label" style={{ fontSize: '0.8rem' }}>Prescribed by {p.doctorName}</div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--pharmacy-primary)', fontWeight: 600 }}>
                                {p.items.length} Medicines
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--pharmacy-text-muted)' }}>
                            <CheckCircle size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                            <p>No pending prescriptions.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail View */}
            <div className="detail-panel">
                {selectedPrescription ? (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="stat-card" style={{ marginBottom: '2rem' }}>
                            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--pharmacy-border)', paddingBottom: '1rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Prescription Details</h1>
                                    <p className="text-label">ID: {selectedPrescription.id} • {selectedPrescription.date}</p>
                                </div>
                                <div className="status-badge" style={{ background: '#fff7ed', color: '#ea580c', height: 'fit-content', padding: '0.5rem 1rem' }}>
                                    Pending Processing
                                </div>
                            </header>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                <div>
                                    <label className="text-label">Patient Name</label>
                                    <div className="text-lg">{selectedPrescription.patientName}</div>
                                </div>
                                <div>
                                    <label className="text-label">Doctor</label>
                                    <div className="text-lg">{selectedPrescription.doctorName}</div>
                                </div>
                            </div>

                            <section>
                                <h3 className="text-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Prescribed Medication</h3>
                                <div style={{ background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--pharmacy-border)' }}>
                                    {selectedPrescription.items.map((item, idx) => {
                                        const stockInfo = checkStock(item.medicineId, item.qty);
                                        return (
                                            <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid var(--pharmacy-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pharmacy-primary)', border: '1px solid var(--pharmacy-border)' }}>
                                                        <Pill size={20} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                                        <div className="text-label" style={{ fontSize: '0.85rem' }}>{item.dosage} • {item.freq} • {item.duration}</div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>x{item.qty}</div>
                                                    {stockInfo.available ? (
                                                        <div style={{ fontSize: '0.75rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                                            <CheckCircle size={12} /> In Stock ({stockInfo.stock})
                                                        </div>
                                                    ) : (
                                                        <div style={{ fontSize: '0.75rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                                            <AlertCircle size={12} /> Insufficient Stock ({stockInfo.stock})
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ color: '#166534', fontWeight: 600 }}>Ready to Dispense?</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#15803d' }}>Stock will be deducted automatically upon confirmation.</p>
                                </div>
                                <button
                                    className="action-btn"
                                    onClick={handleDispense}
                                    style={{ background: '#16a34a', color: 'white', padding: '0.75rem 2rem', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)' }}
                                >
                                    <ShoppingBag size={20} /> Dispense Medicines
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '400px' }}>
                            <div style={{ width: '80px', height: '80px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#0284c7' }}>
                                <Pill size={40} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Select a Prescription</h2>
                            <p className="text-label">Choose a pending prescription from the list to begin dispensing.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PharmacyDispense;
