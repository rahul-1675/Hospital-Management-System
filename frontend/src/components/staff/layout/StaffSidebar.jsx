import React, { useState, useEffect } from 'react';
import { ClipboardList, Calendar, User, LogOut, Clock, ShieldCheck, Activity, LayoutDashboard, Menu, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useStaff } from '../../../context/StaffContext';

const StaffSidebar = ({ activeTab, setActiveTab, isCollapsed, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { staff } = useStaff();
    const [timeLeft, setTimeLeft] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    // Shift Timer Logic
    useEffect(() => {
        const calculateTimeLeft = () => {
            if (staff.shift.status !== 'ON') {
                setTimeLeft('Off Duty');
                return;
            }

            const now = Date.now();
            const end = staff.shift.endTime;
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('Shift Ended');
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [staff.shift]);

    return (
        <nav className={`doctor-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? '80px' : '260px', transition: 'width 0.3s ease' }}>
            <div className="doctor-sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between' }}>
                {!isCollapsed && (
                    <div>
                        <h2>Staff Portal</h2>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 600 }}>
                            ID: {staff.id}
                        </div>
                    </div>
                )}
                <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--reception-text-muted)' }}>
                    {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1 }}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.id}
                                className={`doctor-nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                                style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon size={20} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </div>
                        );
                    })}
                </div>

                <div className="doctor-sidebar-footer">
                    {/* Timer Widget */}
                    {!isCollapsed && (
                        <div style={{
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            background: staff.shift.status === 'ON' ? 'var(--doctor-secondary)' : '#f1f5f9',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={16} color={staff.shift.status === 'ON' ? 'var(--doctor-primary)' : '#94a3b8'} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: staff.shift.status === 'ON' ? 'var(--doctor-primary)' : '#64748b' }}>
                                    {staff.shift.status === 'ON' ? timeLeft : 'Off Duty'}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="doctor-nav-item" onClick={handleLogout} style={{ color: '#ef4444', justifyContent: isCollapsed ? 'center' : 'flex-start' }} title="Logout">
                        <LogOut size={20} />
                        {!isCollapsed && <span>Logout</span>}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default StaffSidebar;
