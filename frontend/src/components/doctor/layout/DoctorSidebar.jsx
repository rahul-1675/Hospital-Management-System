import React from 'react';
import { LayoutDashboard, Calendar, Users, FileText, User, LogOut, Menu, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import BrandLogo from '../../common/BrandLogo';

const DoctorSidebar = ({ activeTab, setActiveTab, isCollapsed, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'patients', label: 'My Patients', icon: Users },
        { id: 'records', label: 'Medical Records', icon: FileText },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className={`doctor-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? '80px' : '260px', transition: 'width 0.3s ease' }}>
            <div className="doctor-sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', padding: isCollapsed ? '1rem 0.5rem' : '1rem 1.25rem' }}>
                {!isCollapsed ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BrandLogo size={38} href="/" />
                    </div>
                ) : (
                    <BrandLogo size={28} href="/" />
                )}
                <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--reception-text-muted)', display: 'flex', alignItems: 'center' }}>
                    {isCollapsed ? <Menu size={22} /> : <ChevronLeft size={22} />}
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
                    <div className="doctor-nav-item" onClick={handleLogout} style={{ color: '#ef4444', justifyContent: isCollapsed ? 'center' : 'flex-start' }} title="Logout">
                        <LogOut size={20} />
                        {!isCollapsed && <span>Logout</span>}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DoctorSidebar;
