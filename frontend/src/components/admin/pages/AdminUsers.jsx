import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Search, Filter, Plus, Edit, Trash2, Shield, Key, AlertTriangle, CheckCircle, XCircle, Users, Check, Clock, UserCheck, UserX, UserMinus, ShieldAlert, RefreshCw } from 'lucide-react';
import { Loader, InlineLoader } from '../../common/Loader';
import AddUserModal from '../modals/AddUserModal';
import { adminService } from '../../../services/admin.service';

const AdminUsers = () => {
    const { users, loadingUsers, addUser, updateUser, deleteUser, toggleUserStatus, approveUser, rejectUser, resetPassword } = useAdmin();
    const [mainView, setMainView] = useState('members'); // 'members' | 'patient-removals'
    const [removalRequests, setRemovalRequests] = useState([]);
    const [loadingRemovals, setLoadingRemovals] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [actionToast, setActionToast] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadRemovalRequests = async () => {
        try {
            setLoadingRemovals(true);
            const data = await adminService.getPatientRemovalRequests();
            setRemovalRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Failed to load removal requests:', err);
        } finally {
            setLoadingRemovals(false);
        }
    };

    useEffect(() => {
        loadRemovalRequests();
    }, []);

    const showToast = (msg) => {
        setActionToast(msg);
        setTimeout(() => setActionToast(null), 3500);
    };

    const handleApproveRemoval = async (req) => {
        setActionLoading(true);
        try {
            const res = await adminService.approvePatientRemoval(req._id || req.id);
            if (res && res.success !== false) {
                showToast(`Patient removal request for "${req.patientName}" approved.`);
                loadRemovalRequests();
            } else {
                showToast('Failed to approve removal request');
            }
        } catch (err) {
            showToast('Error approving removal');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectRemoval = async (req) => {
        setActionLoading(true);
        try {
            const res = await adminService.rejectPatientRemoval(req._id || req.id);
            if (res && res.success !== false) {
                showToast(`Patient removal request for "${req.patientName}" rejected.`);
                loadRemovalRequests();
            } else {
                showToast('Failed to reject removal request');
            }
        } catch (err) {
            showToast('Error rejecting removal');
        } finally {
            setActionLoading(false);
        }
    };

    const pendingRemovalCount = removalRequests.filter(r => r.status === 'Pending').length;
    const pendingCount = users.filter(u => u.status === 'Pending').length;

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.id || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterRole === 'Pending') {
            return matchesSearch && user.status === 'Pending';
        }
        const matchesRole = filterRole === 'All' || user.role?.toLowerCase() === filterRole.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const handleDelete = async () => {
        if (selectedUser) {
            const userName = selectedUser.name;
            await deleteUser(selectedUser.id || selectedUser._id);
            setSelectedUser(null);
            setShowDeleteConfirm(false);
            showToast(`Account "${userName}" has been deleted.`);
        }
    };

    const handleApprove = async () => {
        if (selectedUser) {
            setActionLoading(true);
            const res = await approveUser(selectedUser.id || selectedUser._id);
            setActionLoading(false);
            if (res.success) {
                setSelectedUser(prev => prev ? { ...prev, status: 'Active' } : null);
                showToast(`Account for "${selectedUser.name}" approved and activated!`);
            } else {
                showToast(res.error || 'Failed to approve account');
            }
        }
    };

    const handleReject = async () => {
        if (selectedUser) {
            setActionLoading(true);
            const res = await rejectUser(selectedUser.id || selectedUser._id);
            setActionLoading(false);
            if (res.success) {
                setSelectedUser(prev => prev ? { ...prev, status: 'Rejected' } : null);
                showToast(`Account request for "${selectedUser.name}" rejected.`);
            }
        }
    };

    const handleToggleStatus = async () => {
        if (selectedUser) {
            const res = await toggleUserStatus(selectedUser.id || selectedUser._id);
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active':
                return { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' };
            case 'Pending':
                return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
            case 'Suspended':
                return { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' };
            case 'Rejected':
                return { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };
            default:
                return { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' };
        }
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
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    {/* View Switcher: Accounts vs Patient Removals */}
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px' }}>
                        <button
                            onClick={() => setMainView('members')}
                            style={{
                                flex: 1,
                                padding: '0.5rem 0.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: mainView === 'members' ? '#ffffff' : 'transparent',
                                color: mainView === 'members' ? '#0f172a' : '#64748b',
                                boxShadow: mainView === 'members' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.15s'
                            }}
                        >
                            Members ({users.length})
                        </button>
                        <button
                            onClick={() => setMainView('patient-removals')}
                            style={{
                                flex: 1,
                                padding: '0.5rem 0.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: mainView === 'patient-removals' ? '#ffffff' : 'transparent',
                                color: mainView === 'patient-removals' ? '#0f172a' : '#64748b',
                                boxShadow: mainView === 'patient-removals' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.35rem',
                                transition: 'all 0.15s'
                            }}
                        >
                            <UserMinus size={14} color={pendingRemovalCount > 0 ? '#d97706' : 'currentColor'} />
                            <span>Removals</span>
                            {pendingRemovalCount > 0 && (
                                <span style={{
                                    background: '#d97706',
                                    color: '#ffffff',
                                    padding: '0.05rem 0.45rem',
                                    borderRadius: '99px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800
                                }}>
                                    {pendingRemovalCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {mainView === 'members' ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Hospital Accounts</h3>
                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                        {users.length} accounts {pendingCount > 0 && <span style={{ color: '#d97706', fontWeight: 700 }}>({pendingCount} pending)</span>}
                                    </p>
                                </div>
                                <button
                                    className="action-btn btn-primary"
                                    style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.85rem' }}
                                    onClick={() => setIsAddUserOpen(true)}
                                >
                                    <Plus size={16} />
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
                                {pendingCount > 0 && (
                                    <button
                                        onClick={() => setFilterRole('Pending')}
                                        style={{
                                            padding: '0.35rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                                            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                                            background: filterRole === 'Pending' ? '#d97706' : '#fef3c7',
                                            color: filterRole === 'Pending' ? 'white' : '#92400e',
                                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <Clock size={12} />
                                        <span>Pending ({pendingCount})</span>
                                    </button>
                                )}
                                {['All', 'Doctor', 'Receptionist', 'Pharmacist', 'Staff', 'Patient', 'Admin'].map(role => (
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
                        </>
                    ) : (
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Patient Removals</h3>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                Doctor-submitted patient discharge requests
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {mainView === 'patient-removals' ? (
                        loadingRemovals ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                                <Loader size="44px" text="Loading removal requests..." />
                            </div>
                        ) : removalRequests.length === 0 ? (
                            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                                <UserMinus size={36} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>No removal requests found</p>
                            </div>
                        ) : (
                            removalRequests.map(req => {
                                const isPending = req.status === 'Pending';
                                return (
                                    <div
                                        key={req._id || req.id}
                                        style={{
                                            padding: '1.25rem 1.5rem',
                                            borderBottom: '1px solid #f1f5f9',
                                            background: '#ffffff'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                                                {req.patientName}
                                            </span>
                                            <span style={{
                                                padding: '0.15rem 0.55rem',
                                                borderRadius: '99px',
                                                fontSize: '0.72rem',
                                                fontWeight: 800,
                                                background: isPending ? '#fef3c7' : req.status === 'Approved' ? '#dcfce7' : '#fee2e2',
                                                color: isPending ? '#92400e' : req.status === 'Approved' ? '#166534' : '#991b1b'
                                            }}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <p style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
                                            By: <strong>{req.doctorName || 'Doctor'}</strong> • {req.reason}
                                        </p>
                                        {req.notes && (
                                            <p style={{ margin: '0 0 0.6rem', fontSize: '0.78rem', color: '#334155', fontStyle: 'italic', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                                                "{req.notes}"
                                            </p>
                                        )}
                                        {isPending && (
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <button
                                                    disabled={actionLoading}
                                                    onClick={() => handleApproveRemoval(req)}
                                                    className="action-btn"
                                                    style={{
                                                        background: '#10b981',
                                                        color: '#ffffff',
                                                        border: 'none',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 700,
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '6px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}
                                                >
                                                    <Check size={13} /> Approve Discharge
                                                </button>
                                                <button
                                                    disabled={actionLoading}
                                                    onClick={() => handleRejectRemoval(req)}
                                                    className="action-btn btn-outline"
                                                    style={{
                                                        color: '#ef4444',
                                                        borderColor: '#fca5a5',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 600,
                                                        padding: '0.35rem 0.65rem',
                                                        borderRadius: '6px'
                                                    }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )
                    ) : (
                        loadingUsers ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                                <Loader size="44px" text="Loading members..." />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                                <Users size={36} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>No members found</p>
                            </div>
                        ) : (
                            filteredUsers.map(user => {
                                const badgeStyle = getStatusStyle(user.status || 'Active');
                                return (
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
                                                {user.id || user.staffId || 'ID'}
                                            </span>
                                            <span style={{
                                                ...badgeStyle,
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '999px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700
                                            }}>
                                                {user.status || 'Active'}
                                            </span>
                                        </div>
                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{user.name}</h4>
                                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>{user.role} • {user.department || 'General'}</p>
                                    </div>
                                );
                            })
                        )
                    )}
                </div>
            </div>

            {/* Detail Panel */}
            <div className="detail-panel" style={{ flex: 1, padding: '3rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {mainView === 'patient-removals' ? (
                    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                        <div style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '20px',
                            padding: '2.5rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                    color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <ShieldAlert size={28} />
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                                        Doctor Patient Removal Authorization Desk
                                    </h2>
                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                                        Authorizing discharge or removal permanently marks patient records and updates clinical rosters.
                                    </p>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                    Pending Authorization Summary
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                                    There are currently <strong>{pendingRemovalCount}</strong> pending patient removal requests submitted by attending doctors. Review the list on the left and authorize or reject each request.
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={loadRemovalRequests}
                                    className="action-btn btn-outline"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                    <RefreshCw size={16} /> Refresh Requests
                                </button>
                                <button
                                    onClick={() => setMainView('members')}
                                    className="action-btn btn-primary"
                                >
                                    Return to Member Directory
                                </button>
                            </div>
                        </div>
                    </div>
                ) : selectedUser ? (
                    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.3s' }}>
                        {selectedUser.status === 'Pending' && (
                            <div style={{
                                background: '#fffbeb',
                                border: '1px solid #fde68a',
                                borderRadius: '14px',
                                padding: '1.25rem 1.5rem',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '1rem',
                                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.08)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Clock size={24} color="#d97706" />
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#92400e' }}>
                                            Pending Administrator Approval
                                        </h4>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#b45309' }}>
                                            This user registered online and requires your authorization before logging in.
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                    <button
                                        disabled={actionLoading}
                                        onClick={handleApprove}
                                        className="action-btn"
                                        style={{
                                            background: '#10b981',
                                            color: '#ffffff',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            fontWeight: 700,
                                            padding: '0.55rem 1rem',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <UserCheck size={16} />
                                        <span>Approve & Activate</span>
                                    </button>
                                    <button
                                        disabled={actionLoading}
                                        onClick={handleReject}
                                        className="action-btn btn-outline"
                                        style={{
                                            color: '#ef4444',
                                            borderColor: '#fca5a5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            fontWeight: 600,
                                            padding: '0.55rem 0.85rem',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <UserX size={16} />
                                        <span>Reject</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="detail-card" style={{ padding: '2.5rem', marginBottom: '2rem', background: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '80px', height: '80px', borderRadius: '20px',
                                        background: selectedUser.status === 'Pending' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
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
                                                {selectedUser.id || selectedUser.staffId}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    ...getStatusStyle(selectedUser.status || 'Active'),
                                    fontSize: '0.9rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '999px',
                                    fontWeight: 700
                                }}>
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
                                    <p className="text-value" style={{ fontSize: '1rem', margin: 0, color: selectedUser.status === 'Active' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                                        {selectedUser.status === 'Active' ? 'Hospital Staff Verified' : `Status: ${selectedUser.status}`}
                                    </p>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {selectedUser.status === 'Pending' ? (
                                    <button
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                        className="action-btn"
                                        style={{ background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                                    >
                                        <CheckCircle size={18} />
                                        <span>Approve Account</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleToggleStatus}
                                        className="action-btn btn-outline"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                                    >
                                        <Shield size={18} />
                                        <span>{selectedUser.status === 'Active' ? 'Suspend Account' : 'Activate Account'}</span>
                                    </button>
                                )}
                                <span style={{ flex: 1 }}></span>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="action-btn"
                                    style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                                >
                                    <Trash2 size={18} />
                                    <span>Delete Account</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                        <Users size={64} style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#94a3b8', fontWeight: 600 }}>Select a member to view details & permissions</h3>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#cbd5e1' }}>Admins can approve pending accounts, suspend, or delete any user</p>
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
