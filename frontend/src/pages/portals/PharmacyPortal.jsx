import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Pill, Package, ClipboardList, FileText, User, LogOut, Menu, ChevronLeft } from 'lucide-react';
import MedicineBg from '../../assets/Medicine.png';
import { PharmacyProvider } from '../../context/PharmacyContext';

import BrandLogo from '../../components/common/BrandLogo';

// Pages
import PharmacyDashboard from '../../components/pharmacy/pages/PharmacyDashboard';
import PharmacyDispense from '../../components/pharmacy/pages/PharmacyDispense';
import PharmacyInventory from '../../components/pharmacy/pages/PharmacyInventory';

import PharmacyOrders from '../../components/pharmacy/pages/PharmacyOrders';
import PharmacyReports from '../../components/pharmacy/pages/PharmacyReports';
import PharmacyProfile from '../../components/pharmacy/pages/PharmacyProfile';

// Styles
import '../../styles/pharmacy-portal.css';

const PharmacyPortal = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <PharmacyDashboard setActiveTab={setActiveTab} />;
            case 'dispense':
                return <PharmacyDispense />;
            case 'inventory':
                return <PharmacyInventory />;
            case 'orders':
                return <PharmacyOrders />;
            case 'reports':
                return <PharmacyReports />;
            case 'profile':
                return <PharmacyProfile />;
            default:
                return (
                    <PharmacyDashboard setActiveTab={setActiveTab} />
                );
        }
    };

    const NavItem = ({ id, icon: Icon, label }) => (
        <div
            className={`pharmacy-nav-item ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
            style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
            title={isSidebarCollapsed ? label : ''}
        >
            <Icon size={20} />
            {!isSidebarCollapsed && <span>{label}</span>}
        </div>
    );

    return (
        <PharmacyProvider>
            <div className="pharmacy-portal-container" style={{
                background: '#ffffff',
                backgroundColor: '#ffffff',
                minHeight: '100vh'
            }}>
                <nav className={`pharmacy-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} style={{ width: isSidebarCollapsed ? '80px' : '260px', transition: 'width 0.3s ease' }}>
                    <div className="pharmacy-sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', padding: isSidebarCollapsed ? '1rem 0.5rem' : '1rem 1.25rem' }}>
                        {!isSidebarCollapsed ? (
                            <BrandLogo size={36} showTitle={true} subtitle="Pharmacy & Dispensary" href="/" />
                        ) : (
                            <BrandLogo size={30} showTitle={false} href="/" />
                        )}
                        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pharmacy-text-muted)', display: 'flex', alignItems: 'center' }}>
                            {isSidebarCollapsed ? <Menu size={22} /> : <ChevronLeft size={22} />}
                        </button>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem id="dispense" icon={Pill} label="Dispense" />
                        <NavItem id="inventory" icon={Package} label="Inventory" />
                        <NavItem id="orders" icon={ClipboardList} label="Orders" />
                        <NavItem id="reports" icon={FileText} label="Reports" />
                    </div>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--pharmacy-border)', paddingTop: '1rem' }}>
                        <NavItem id="profile" icon={User} label="Profile" />
                        <div className="pharmacy-nav-item" onClick={handleLogout} style={{ color: 'var(--pharmacy-danger)', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }} title="Logout">
                            <LogOut size={20} />
                            {!isSidebarCollapsed && <span>Logout</span>}
                        </div>
                    </div>
                </nav>

                <main className="pharmacy-main">
                    {renderContent()}
                </main>
            </div>
        </PharmacyProvider>
    );
};

export default PharmacyPortal;
