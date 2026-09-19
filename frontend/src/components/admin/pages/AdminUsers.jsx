import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Search, Filter, Plus, MoreVertical, Edit, Trash2, Shield, Key, AlertTriangle, CheckCircle, XCircle, Users } from 'lucide-react';

import AddUserModal from '../modals/AddUserModal';

const AdminUsers = () => {
    const { users, addUser, updateUser, deleteUser, toggleUserStatus, resetPassword } = useAdmin();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleDelete = () => {
        if (selectedUser) {
            deleteUser(selectedUser.id);
            setSelectedUser(null);
            setShowDeleteConfirm(false);
        }
    };

    const handleUserAdded = (newUser) => {
        setSelectedUser(newUser);
        setSearchTerm(''); // Clear search so new user is visible if they don't match
        setFilterRole('All'); // Reset filter
    };

    return (
        <div className="split-view-container" style={{ background: '#f8fafc' }}>
            {/* List Panel */}
            <div className="list-panel" style={{ width: '380px', borderRight: '1px solid #e2e8f0', background: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Users</h2>
                        <button
                            className="action-btn btn-primary"
                            style={{ padding: '0.5rem', borderRadius: '8px' }}
                            onClick={() => setIsAddUserOpen(true)}
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="search-bar-container" style={{ padding: 0, border: 'none', marginBottom: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="search-input"
                                style={{ paddingLeft: '2.5rem', background: '#f8fafc' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {['All', 'Doctor', 'Nurse', 'Admin', 'Receptionist', 'Pharmacist'].map(role => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                style={{
                                    padding: '0.35rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                                    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                                    background: filterRole === role ? '#1e293b' : '#f1f5f9',
                                    color: filterRole === role ? 'white' : '#64748b'
                                }}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredUsers.map(user => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            style={{
                                padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                                background: selectedUser?.id === user.id ? '#f8fafc' : 'white',
                                borderLeft: selectedUser?.id === user.id ? '4px solid #1e293b' : '4px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: 600, color: '#1e293b' }}>{user.id}</span>
                                <span className={`status-badge ${user.status === 'Active' ? 'status-checked-in' : 'status-in-consultation'}`} style={{ fontSize: '0.7rem' }}>
                                    {user.status}
                                </span>
                            </div>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>{user.name}</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{user.role} • {user.department}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Panel */}
            <div className="detail-panel" style={{ flex: 1, padding: '3rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {selectedUser ? (
                    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.3s' }}>
                        <div className="detail-card" style={{ padding: '3rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '100px', height: '100px', borderRadius: '50%', background: '#1e293b',
                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2.5rem', fontWeight: 700
                                    }}>
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: 0, marginBottom: '0.5rem' }}>{selectedUser.name}</h1>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>{selectedUser.email}</span>
                                            <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>{selectedUser.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`status-badge ${selectedUser.status === 'Active' ? 'status-checked-in' : 'status-in-consultation'}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                    {selectedUser.status}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                                <div>
                                    <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
                                    <p className="text-value" style={{ fontSize: '1.1rem' }}>{selectedUser.role}</p>
                                </div>
                                <div>
                                    <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Department</label>
                                    <p className="text-value" style={{ fontSize: '1.1rem' }}>{selectedUser.department}</p>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <button className="action-btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Edit size={18} /> Edit User
                                </button>
                                <button onClick={() => toggleUserStatus(selectedUser.id)} className="action-btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Shield size={18} /> {selectedUser.status === 'Active' ? 'Suspend' : 'Activate'}
                                </button>
                                <button onClick={() => resetPassword(selectedUser.id)} className="action-btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Key size={18} /> Reset Password
                                </button>
                                <span style={{ flex: 1 }}></span>
                                <button onClick={() => setShowDeleteConfirm(true)} className="action-btn" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Trash2 size={18} /> Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                        <Users size={64} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#cbd5e1' }}>Select a user to view details</h3>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div className="detail-card" style={{ width: '450px', padding: '2rem', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '50%', color: '#ef4444' }}>
                                <AlertTriangle size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Delete User?</h2>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                            Are you sure you want to permanently delete <strong>{selectedUser?.name}</strong>? This action cannot be undone and will remove all associated access.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="action-btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="action-btn" style={{ flex: 1, background: '#ef4444', color: 'white', justifyContent: 'center' }} onClick={handleDelete}>Delete Permanently</button>
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
