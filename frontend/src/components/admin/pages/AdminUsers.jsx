import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Search, Filter, Plus, Edit, Trash2, Shield, Key, AlertTriangle, CheckCircle, XCircle, Users, Check } from 'lucide-react';
import { Loader, InlineLoader } from '../../common/Loader';
import AddUserModal from '../modals/AddUserModal';

const AdminUsers = () => {
    const { users, loadingUsers, addUser, updateUser, deleteUser, toggleUserStatus, resetPassword } = useAdmin();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [actionToast, setActionToast] = useState(null);

    const showToast = (msg) => {
        setActionToast(msg);
        setTimeout(() => setActionToast(null), 3500);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.id || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role?.toLowerCase() === filterRole.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const handleDelete = async () => {
        if (selectedUser) {
            const userName = selectedUser.name;
            await deleteUser(selectedUser.id);
            setSelectedUser(null);
            setShowDeleteConfirm(false);
            showToast(`Member "${userName}" has been removed.`);
        }
    };

    const handleToggleStatus = async () => {
        if (selectedUser) {
            const res = await toggleUserStatus(selectedUser.id);
            const newStatus = selectedUser.status === 'Active' ? 'Suspended' : 'Active';
            setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
            showToast(`Status updated to ${newStatus}`);
        }
    };

    const handleUserAdded = (newUser) => {
        setSelectedUser(newUser);
        setSearchTerm('');
        setFilterRole('All');
        showToast(`Member "${newUser.name}" added successfully.`);
    };

    return (
        <div className="split-view-container" style={{ background: '#f8fafc', position: 'relative' }}>
            {/* Action Toast */}
            {actionToast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    zIndex: 10000,
                    animation: 'slideIn 0.3s ease'
                }}>
                    <CheckCircle size={18} color="#10b981" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{actionToast}</span>
                </div>
            )}

            {/* List Panel */}
            <div className="list-panel" style={{ width: '380px', borderRight: '1px solid #e2e8f0', background: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Hospital Members</h2>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>{users.length} registered accounts</p>
                        </div>
                        <button
                            className="action-btn btn-primary"
                            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                            onClick={() => setIsAddUserOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Add</span>
                        </button>
                    </div>

                    <div className="search-bar-container" style={{ padding: 0, border: 'none', marginBottom: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search by name, ID, email..."
                                className="search-input"
                                style={{ paddingLeft: '2.5rem', background: '#f8fafc', width: '100%', boxSizing: 'border-box' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {['All', 'Doctor', 'Receptionist', 'Pharmacist', 'Staff', 'Admin'].map(role => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                style={{
                                    padding: '0.35rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                                    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                                    background: filterRole.toLowerCase() === role.toLowerCase() ? '#0284c7' : '#f1f5f9',
                                    color: filterRole.toLowerCase() === role.toLowerCase() ? 'white' : '#64748b',
                                    transition: 'all 0.15s'
                                }}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {loadingUsers ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                            <Loader size="44px" text="Loading members..." />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                            <Users size={36} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>No members found</p>
                        </div>
                    ) : (
                        filteredUsers.map(user => (
                            <div
                                key={user.id || user._id}
                                onClick={() => setSelectedUser(user)}
                                style={{
                                    padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                                    background: selectedUser?.id === user.id ? '#f0f9ff' : 'white',
                                    borderLeft: selectedUser?.id === user.id ? '4px solid #0284c7' : '4px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 700, color: '#0284c7', fontSize: '0.85rem', fontFamily: 'var(--font-mono, monospace)' }}>
                                        {user.id}
                                    </span>
                                    <span className={`status-badge ${user.status === 'Active' ? 'status-checked-in' : 'status-in-consultation'}`} style={{ fontSize: '0.7rem' }}>
                                        {user.status || 'Active'}
                                    </span>
                                </div>
                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{user.name}</h4>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>{user.role} • {user.department || 'General'}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail Panel */}
            <div className="detail-panel" style={{ flex: 1, padding: '3rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {selectedUser ? (
                    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.3s' }}>
                        <div className="detail-card" style={{ padding: '2.5rem', marginBottom: '2rem', background: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '80px', height: '80px', borderRadius: '20px',
                                        background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2rem', fontWeight: 800, boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)'
                                    }}>
                                        {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0, marginBottom: '0.4rem' }}>
                                            {selectedUser.name}
                                        </h1>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>{selectedUser.email}</span>
                                            <span className="status-badge" style={{ background: '#e0f2fe', color: '#0284c7', fontWeight: 700, fontFamily: 'monospace' }}>
                                                {selectedUser.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`status-badge ${selectedUser.status === 'Active' ? 'status-checked-in' : 'status-in-consultation'}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                    {selectedUser.status || 'Active'}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                <div>
                                    <label className="text-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>Assigned Role</label>
                                    <p className="text-value" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{selectedUser.role}</p>
                                </div>
                                <div>
                                    <label className="text-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>Department</label>
                                    <p className="text-value" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{selectedUser.department || 'General Care'}</p>
                                </div>
                                <div>
                                    <label className="text-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>Phone Contact</label>
                                    <p className="text-value" style={{ fontSize: '1rem', margin: 0, color: '#334155' }}>{selectedUser.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>Account Authority</label>
                                    <p className="text-value" style={{ fontSize: '1rem', margin: 0, color: '#10b981', fontWeight: 600 }}>Hospital Staff Verified</p>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <button
                                    onClick={handleToggleStatus}
                                    className="action-btn btn-outline"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                                >
                                    <Shield size={18} />
                                    <span>{selectedUser.status === 'Active' ? 'Suspend Account' : 'Activate Account'}</span>
                                </button>
                                <span style={{ flex: 1 }}></span>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="action-btn"
                                    style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                                >
                                    <Trash2 size={18} />
                                    <span>Remove Member</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                        <Users size={64} style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#94a3b8', fontWeight: 600 }}>Select a member to view details & permissions</h3>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#cbd5e1' }}>Admins can add, edit, suspend, or remove any member</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="detail-card" style={{ width: '460px', padding: '2rem', borderRadius: '18px', background: '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '50%', color: '#ef4444' }}>
                                <AlertTriangle size={26} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Remove Member?</h2>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Permanently revoke portal access</p>
                            </div>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                            Are you sure you want to permanently remove <strong>{selectedUser?.name}</strong> ({selectedUser?.role})? They will no longer be able to log in to the hospital system.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="action-btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </button>
                            <button className="action-btn" style={{ flex: 1, background: '#ef4444', color: 'white', justifyContent: 'center', fontWeight: 700 }} onClick={handleDelete}>
                                Remove Member
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AddUserModal
                isOpen={isAddUserOpen}
                onClose={() => setIsAddUserOpen(false)}
                onUserAdded={handleUserAdded}
            />
        </div>
    );
};

export default AdminUsers;
