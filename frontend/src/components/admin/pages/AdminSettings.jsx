import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Lock, Unlock, Building, Settings, CheckCircle2, AlertCircle, Phone, MapPin, Mail } from 'lucide-react';
import { adminService } from '../../../services/admin.service';

const AdminSettings = () => {
    const [locked, setLocked] = useState(true);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        hospitalName: 'ProHealth Central Super Specialty Hospital',
        address: '123 Health Avenue, Medical District',
        city: 'New York',
        contactPhone: '+1 (800) 123-4567',
        emergencyPhone: '+1 (800) 911-0001',
        email: 'central@prohealth-hms.com',
        systemTheme: 'Light',
        autoBackup: true,
        maintenanceMode: false
    });

    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const settings = await adminService.getSettings();
                if (settings) {
                    setFormData(prev => ({ ...prev, ...settings }));
                }
            } catch (err) {
                console.warn('Error loading settings:', err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        setSaveMessage('');
        setErrorMessage('');
    };

    const toggleLock = () => {
        setLocked(!locked);
        setSaveMessage('');
    };

    const handleSaveChanges = async () => {
        if (locked) return;
        setSaving(true);
        setSaveMessage('');
        setErrorMessage('');

        try {
            await adminService.updateSettings(formData);
            setSaveMessage('Hospital system configuration saved successfully in database.');
            setLocked(true);
        } catch (err) {
            setErrorMessage(err.message || 'Failed to update system settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleRestoreDefaults = async () => {
        if (locked) return;
        const defaultSettings = {
            hospitalName: 'ProHealth Central Super Specialty Hospital',
            address: '123 Health Avenue, Medical District',
            city: 'New York',
            contactPhone: '+1 (800) 123-4567',
            emergencyPhone: '+1 (800) 911-0001',
            email: 'central@prohealth-hms.com',
            systemTheme: 'Light',
            autoBackup: true,
            maintenanceMode: false
        };

        setFormData(defaultSettings);
        try {
            await adminService.updateSettings(defaultSettings);
            setSaveMessage('Restored system defaults successfully.');
            setLocked(true);
        } catch (err) {
            setErrorMessage('Could not restore defaults.');
        }
    };

    return (
        <div style={{ padding: '2.5rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                        System Configuration
                    </h1>
                    <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>
                        Manage hospital branch details, emergency hotlines, and cloud preferences.
                    </p>
                </div>
                <button
                    onClick={toggleLock}
                    className="action-btn"
                    style={{
                        background: locked ? '#fef2f2' : '#f0fdf4',
                        color: locked ? '#ef4444' : '#16a34a',
                        border: locked ? '1px solid #fee2e2' : '1px solid #bbf7d0',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontWeight: 700,
                        padding: '0.65rem 1.25rem'
                    }}
                >
                    {locked ? <Lock size={18} /> : <Unlock size={18} />}
                    {locked ? 'Settings Locked (Click to Edit)' : 'Editing Enabled'}
                </button>
            </header>

            {/* Notification Messages */}
            {saveMessage && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.25rem',
                    borderRadius: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0',
                    color: '#059669', fontWeight: 700, marginBottom: '1.75rem'
                }}>
                    <CheckCircle2 size={20} />
                    <span>{saveMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.25rem',
                    borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca',
                    color: '#b91c1c', fontWeight: 700, marginBottom: '1.75rem'
                }}>
                    <AlertCircle size={20} />
                    <span>{errorMessage}</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px' }}>
                {/* Hospital Details */}
                <div className="detail-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                        <div style={{ padding: '0.6rem', background: '#eff6ff', borderRadius: '10px', color: '#0284c7' }}>
                            <Building size={22} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Hospital Profile</h3>
                            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Core medical center identifying information</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                Hospital Full Name
                            </label>
                            <input
                                type="text" name="hospitalName" value={formData.hospitalName} onChange={handleInputChange} disabled={locked}
                                className="search-input" style={{ width: '100%', opacity: locked ? 0.75 : 1, borderRadius: '10px', padding: '0.65rem 1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                Physical Address & City
                            </label>
                            <input
                                type="text" name="address" value={formData.address} onChange={handleInputChange} disabled={locked}
                                className="search-input" style={{ width: '100%', opacity: locked ? 0.75 : 1, borderRadius: '10px', padding: '0.65rem 1rem' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                    Main Contact Phone
                                </label>
                                <input
                                    type="text" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} disabled={locked}
                                    className="search-input" style={{ width: '100%', opacity: locked ? 0.75 : 1, borderRadius: '10px', padding: '0.65rem 1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.4rem' }}>
                                    Emergency Hotline
                                </label>
                                <input
                                    type="text" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} disabled={locked}
                                    className="search-input" style={{ width: '100%', opacity: locked ? 0.75 : 1, borderRadius: '10px', padding: '0.65rem 1rem' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Preferences */}
                <div className="detail-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                        <div style={{ padding: '0.6rem', background: '#f5f3ff', borderRadius: '10px', color: '#7c3aed' }}>
                            <Settings size={22} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>System Preferences</h3>
                            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Automated operations & theme settings</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <div>
                                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>Automatic Cloud Backups</h4>
                                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0' }}>Backup MongoDB records every 24 hours</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" name="autoBackup" checked={formData.autoBackup} onChange={handleInputChange} disabled={locked} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <div>
                                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>Maintenance Mode</h4>
                                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0' }}>Restrict portal access to administrators only</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleInputChange} disabled={locked} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                Default Theme
                            </label>
                            <select
                                name="systemTheme" value={formData.systemTheme} onChange={handleInputChange} disabled={locked}
                                className="search-input" style={{ width: '100%', opacity: locked ? 0.75 : 1, borderRadius: '10px', padding: '0.65rem 1rem' }}
                            >
                                <option value="Light">Light Mode (Clean Clinical)</option>
                                <option value="Dark">Dark Mode</option>
                                <option value="System">System Default</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2.5rem', padding: '1.5rem 0', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', maxWidth: '1200px' }}>
                <button
                    disabled={locked || saving}
                    onClick={handleRestoreDefaults}
                    className="action-btn btn-outline"
                    style={{ opacity: locked ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <RotateCcw size={18} /> Restore Defaults
                </button>
                <button
                    disabled={locked || saving}
                    onClick={handleSaveChanges}
                    className="action-btn btn-primary"
                    style={{ opacity: locked ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                >
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
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
                        background-color: #0284c7;
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

