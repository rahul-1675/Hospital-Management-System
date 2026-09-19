
import { LayoutDashboard, Calendar, UserPlus, Users, FileText, User, LogOut, Menu, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import BrandLogo from '../../common/BrandLogo';

const ReceptionSidebar = ({ activeTab, setActiveTab, isCollapsed, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'registration', label: 'Patient Registration', icon: UserPlus },
        { id: 'queue', label: 'Queue Management', icon: Users },
        { id: 'billing', label: 'Billing', icon: FileText },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className={`reception-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? '80px' : '260px', transition: 'width 0.3s ease' }}>
            <div className="reception-sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', padding: isCollapsed ? '1rem 0.5rem' : '1rem 1.25rem' }}>
                {!isCollapsed ? (
                    <BrandLogo size={36} showTitle={true} subtitle="Reception Desk" href="/" />
                ) : (
                    <BrandLogo size={30} showTitle={false} href="/" />
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
                                className={`reception-nav-item ${activeTab === item.id ? 'active' : ''}`}
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

                <div className="reception-sidebar-footer">
                    <div className="reception-nav-item" onClick={handleLogout} style={{ color: '#ef4444', justifyContent: isCollapsed ? 'center' : 'flex-start' }} title="Logout">
                        <LogOut size={20} />
                        {!isCollapsed && <span>Logout</span>}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default ReceptionSidebar;
