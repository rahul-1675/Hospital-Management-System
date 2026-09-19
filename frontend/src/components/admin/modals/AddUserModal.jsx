import React, { useState } from 'react';
import { UserPlus, AlertCircle, X, CheckCircle, Copy, Check, Lock } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { InlineLoader } from '../../common/Loader';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const { addUser, checkEmailUnique } = useAdmin();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Doctor',
        department: 'Cardiology',
        specialization: '',
        password: '',
        status: 'Active'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newUserCreds, setNewUserCreds] = useState(null); // { userId, password }
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        if (formData.role !== 'Admin' && !formData.department.trim()) {
            newErrors.department = 'Department is required for this role.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        const result = await addUser(formData);
        setIsSubmitting(false);

        if (result && result.success) {
            setNewUserCreds({
                userId: result.user.id || result.user.staffId || result.user.email,
                name: result.user.name,
                role: result.user.role,
                password: result.tempPassword || formData.password
            });
            if (onUserAdded) {
                onUserAdded(result.user);
            }
        } else {
            setErrors({ submit: result?.error || 'Failed to create user. Please try again.' });
        }
    };

    const handleCopy = () => {
        if (!newUserCreds) return;
        const text = `Hospital System Credentials:\nName: ${newUserCreds.name}\nRole: ${newUserCreds.role}\nUser ID / Email: ${newUserCreds.userId}\nPassword: ${newUserCreds.password}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: 'Doctor',
            department: 'Cardiology',
            specialization: '',
            password: '',
            status: 'Active'
        });
        setErrors({});
        setNewUserCreds(null);
        setCopied(false);
        onClose();
    };

    // Success View with Credentials
    if (newUserCreds) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)'
            }}>
                <div className="detail-card" style={{ width: '480px', padding: '2.5rem', borderRadius: '20px', textAlign: 'center', background: '#ffffff', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                    <div style={{ width: '64px', height: '64px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid #a7f3d0' }}>
                        <CheckCircle size={36} />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                        Member Added Successfully!
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                        The account has been created in the hospital database. Provide these credentials to the user:
                    </p>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Full Name</span>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{newUserCreds.name} ({newUserCreds.role})</div>
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Login ID / Email</span>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', fontFamily: 'var(--font-mono, monospace)' }}>{newUserCreds.userId}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Password</span>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono, monospace)', background: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', display: 'inline-block', marginTop: '0.25rem' }}>
                                {newUserCreds.password}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            type="button"
                            className="action-btn btn-outline"
                            style={{ flex: 1, justifyContent: 'center', gap: '0.4rem' }}
                            onClick={handleCopy}
                        >
                            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
                            <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
                        </button>
                        <button
                            type="button"
                            className="action-btn btn-primary"
                            style={{ flex: 1, justifyContent: 'center' }}
                            onClick={handleClose}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }}>
            <div className="detail-card" style={{ width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', background: '#ffffff', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Add Hospital Member</h2>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Create staff profile & generate portal access</p>
                        </div>
                    </div>
                    <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={22} />
                    </button>
                </div>

                {errors.submit && (
                    <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#b91c1c', fontSize: '0.88rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} />
                        <span>{errors.submit}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="text-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Full Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Dr. Jennifer Adams"
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: errors.name ? '1.5px solid #ef4444' : '1px solid #cbd5e1', boxSizing: 'border-box' }}
                            />
                            {errors.name && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Email Address <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="jennifer@hms.com"
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: errors.email ? '1.5px solid #ef4444' : '1px solid #cbd5e1', boxSizing: 'border-box' }}
                            />
                            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 012-3456"
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Hospital Role <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="form-select"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                            >
                                <option value="Doctor">Doctor / Physician</option>
                                <option value="Receptionist">Receptionist / Front Desk</option>
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Staff">Clinical / Nursing Staff</option>
                                <option value="Admin">Administrator</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Department <span style={formData.role === 'Admin' ? { display: 'none' } : { color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                disabled={formData.role === 'Admin'}
                                placeholder={formData.role === 'Admin' ? 'Management' : 'e.g. Cardiology'}
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: errors.department ? '1.5px solid #ef4444' : '1px solid #cbd5e1', boxSizing: 'border-box' }}
                            />
                            {errors.department && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>{errors.department}</span>}
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="text-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Initial Password (Optional — Auto-generated if blank)
                            </label>
                            <input
                                type="text"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Leave blank to auto-generate a secure password"
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                        <button type="button" className="action-btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="action-btn btn-primary"
                            style={{ flex: 2, justifyContent: 'center', fontWeight: 700 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <InlineLoader size="18px" text="Creating Member..." /> : 'Add Member to Hospital'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
