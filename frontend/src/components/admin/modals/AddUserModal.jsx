import React, { useState } from 'react';
import { UserPlus, AlertCircle, X, CheckCircle, Copy, RefreshCw } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const { addUser, checkEmailUnique } = useAdmin();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        specialization: '', // Only for Doctor
        status: 'Active'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newUserCreds, setNewUserCreds] = useState(null); // { userId, password }

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        } else if (!checkEmailUnique(formData.email)) {
            newErrors.email = 'Email already exists.';
        }

        if (!formData.role) newErrors.role = 'Role is required.';

        if (formData.role !== 'Admin' && formData.role !== '' && !formData.department.trim()) {
            newErrors.department = 'Department is required for this role.';
        }

        if (formData.role === 'Doctor' && !formData.specialization.trim()) {
            newErrors.specialization = 'Specialization is required for Doctors.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            const result = addUser(formData);
            setIsSubmitting(false);
            if (result.success) {
                setNewUserCreds({ userId: result.user.id, password: result.tempPassword });
                onUserAdded(result.user);
            } else {
                setErrors({ submit: 'Failed to create user. Please try again.' });
            }
        }, 1000);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: '',
            department: '',
            specialization: '',
            status: 'Active'
        });
        setErrors({});
        setNewUserCreds(null);
        onClose();
    };

    // Success View with Credentials
    if (newUserCreds) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div className="detail-card" style={{ width: '450px', padding: '2.5rem', borderRadius: '16px', textAlign: 'center', animation: 'slideUp 0.3s ease' }}>
                    <div style={{ width: '60px', height: '60px', background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>User Created!</h2>
                    <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem' }}>
                        The user <strong>{formData.name}</strong> has been successfully added to the system.
                    </p>

                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', textAlign: 'left' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="text-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>User ID</label>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <code style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b' }}>{newUserCreds.userId}</code>
                                <Copy size={16} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(newUserCreds.userId)} />
                            </div>
                        </div>
                        <div>
                            <label className="text-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Temporary Password</label>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <code style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b' }}>{newUserCreds.password}</code>
                                <Copy size={16} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(newUserCreds.password)} />
                            </div>
                        </div>
                    </div>

                    <button className="action-btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleClose}>
                        Done
                    </button>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>An email with these credentials has been sent.</p>
                </div>
            </div>
        );
    }

    // Form View
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="detail-card" style={{ width: '600px', maxWidth: '95%', padding: '2rem', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '50%', color: '#2563eb' }}>
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Add New User</h2>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Create a profile and assign permissions</p>
                        </div>
                    </div>
                    <button className="btn-ghost" onClick={handleClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleInputChange}
                                className="search-input" style={{ width: '100%', borderColor: errors.name ? '#ef4444' : undefined }}
                                placeholder="e.g. Dr. John Doe"
                            />
                            {errors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleInputChange}
                                className="search-input" style={{ width: '100%', borderColor: errors.email ? '#ef4444' : undefined }}
                                placeholder="john.doe@hms.com"
                            />
                            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                            <input
                                type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                                className="search-input" style={{ width: '100%' }}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Role <span style={{ color: 'red' }}>*</span></label>
                            <select
                                name="role" value={formData.role} onChange={handleInputChange}
                                className="search-input" style={{ width: '100%', borderColor: errors.role ? '#ef4444' : undefined }}
                            >
                                <option value="">Select Role...</option>
                                <option value="Admin">Admin</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Staff">Staff</option>
                            </select>
                            {errors.role && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.role}</span>}
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Department <span style={formData.role === 'Admin' ? { display: 'none' } : { color: 'red' }}>*</span></label>
                            <input
                                type="text" name="department" value={formData.department} onChange={handleInputChange}
                                className="search-input" style={{ width: '100%', borderColor: errors.department ? '#ef4444' : undefined, opacity: formData.role === 'Admin' ? 0.5 : 1 }}
                                disabled={formData.role === 'Admin'}
                                placeholder={formData.role === 'Admin' ? 'N/A' : 'e.g. Cardiology'}
                            />
                            {errors.department && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.department}</span>}
                        </div>

                        {formData.role === 'Doctor' && (
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Specialization <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text" name="specialization" value={formData.specialization} onChange={handleInputChange}
                                    className="search-input" style={{ width: '100%', borderColor: errors.specialization ? '#ef4444' : undefined }}
                                    placeholder="e.g. Heart Surgeon"
                                />
                                {errors.specialization && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.specialization}</span>}
                            </div>
                        )}

                        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                            <AlertCircle size={18} color="#64748b" />
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                A temporary password will be generated and sent to the email provided. The user status will be set to <strong>Active</strong> by default.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                        <button type="button" className="action-btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="action-btn btn-primary"
                            style={{ flex: 1, justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <><RefreshCw className="spin" size={18} /> Creating...</> : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
            <style>
                {`
                   @keyframes spin {
                       from { transform: rotate(0deg); }
                       to { transform: rotate(360deg); }
                   }
                   .spin {
                       animation: spin 1s linear infinite;
                   }
               `}
            </style>
        </div>
    );
};

export default AddUserModal;
