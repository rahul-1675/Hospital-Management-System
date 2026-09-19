import React, { useState } from 'react';
import { Save, RotateCcw, Lock, Unlock, Building, Users, Settings, Shield } from 'lucide-react';

const AdminSettings = () => {
    const [locked, setLocked] = useState(true);
    const [formData, setFormData] = useState({
        hospitalName: 'General Hospital',
        address: '123 Medical Drive, Health City',
        contactPhone: '+1 (555) 000-0000',
        systemTheme: 'Light',
        autoBackup: true,
        maintenanceMode: false
    });

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const toggleLock = () => {
        // In a real app, this would require password confirmation
        setLocked(!locked);
    };

    return (
        <div style={{ padding: '2.5rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#000080', marginBottom: '0.5rem' }}>System Configuration</h1>
                    <p className="text-label" style={{ fontSize: '1.1rem', color: '#000080' }}>Manage global system settings and preferences.</p>
                </div>
                <button
                    onClick={toggleLock}
                    className="action-btn"
                    style={{
                        background: locked ? '#fef2f2' : '#f0fdf4',
                        color: locked ? '#ef4444' : '#16a34a',
                        border: locked ? '1px solid #fee2e2' : '1px solid #bbf7d0',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    {locked ? <Lock size={18} /> : <Unlock size={18} />}
                    {locked ? 'Settings Locked' : 'Editing Enabled'}
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px' }}>
                {/* Hospital Details */}
                <div className="detail-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
                            <Building size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#000080' }}>Hospital Details</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Hospital Name</label>
                            <input
                                type="text" name="hospitalName" value={formData.hospitalName} onChange={handleInputChange} disabled={locked}
                                className="search-input" style={{ width: '100%', opacity: locked ? 0.7 : 1 }}
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Address</label>
                            <input
                                type="text" name="address" value={formData.address} onChange={handleInputChange} disabled={locked}
                                className="search-input" style={{ width: '100%', opacity: locked ? 0.7 : 1 }}
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Emergency Contact</label>
                            <input
                                type="text" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} disabled={locked}
                                className="search-input" style={{ width: '100%', opacity: locked ? 0.7 : 1 }}
                            />
                        </div>
                    </div>
                </div>

                {/* System Preferences */}
                <div className="detail-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: '#f5f3ff', borderRadius: '8px', color: '#7c3aed' }}>
                            <Settings size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#000080' }}>System Preferences</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: 0, color: '#334155' }}>Automatic Backups</h4>
                                <p className="text-label" style={{ fontSize: '0.85rem', margin: 0 }}>Backup database every 24 hours</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" name="autoBackup" checked={formData.autoBackup} onChange={handleInputChange} disabled={locked} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: 0, color: '#334155' }}>Maintenance Mode</h4>
                                <p className="text-label" style={{ fontSize: '0.85rem', margin: 0 }}>Restrict access to admins only</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleInputChange} disabled={locked} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Default Theme</label>
                            <select
                                name="systemTheme" value={formData.systemTheme} onChange={handleInputChange} disabled={locked}
                                className="search-input" style={{ width: '100%', opacity: locked ? 0.7 : 1 }}
                            >
                                <option>Light</option>
                                <option>Dark</option>
                                <option>System</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                    disabled={locked}
                    className="action-btn btn-outline"
                    style={{ opacity: locked ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <RotateCcw size={18} /> Restore Defaults
                </button>
                <button
                    disabled={locked}
                    className="action-btn btn-primary"
                    style={{ opacity: locked ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <style>
                {`
                    .switch {
                        position: relative;
                        display: inline-block;
                        width: 50px;
                        height: 24px;
                    }
                    .switch input { opacity: 0; width: 0; height: 0; }
                    .slider {
                        position: absolute;
                        cursor: pointer;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background-color: #cbd5e1;
                        transition: .4s;
                        border-radius: 34px;
                    }
                    .slider:before {
                        position: absolute;
                        content: "";
                        height: 16px;
                        width: 16px;
                        left: 4px;
                        bottom: 4px;
                        background-color: white;
                        transition: .4s;
                        border-radius: 50%;
                    }
                    input:checked + .slider {
                        background-color: var(--doctor-primary);
                    }
                    input:checked + .slider:before {
                        transform: translateX(26px);
                    }
                    input:disabled + .slider {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                `}
            </style>
        </div>
    );
};

export default AdminSettings;
