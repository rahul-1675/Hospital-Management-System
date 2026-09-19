import React, { useState } from 'react';
import '../../styles/doctor-portal.css';
import { AdminProvider } from '../../context/AdminContext';
import AdminSidebar from '../../components/admin/layout/AdminSidebar';
import AdminOverview from '../../components/admin/pages/AdminOverview';
import AdminUsers from '../../components/admin/pages/AdminUsers';
import AdminLogs from '../../components/admin/pages/AdminLogs';
import AdminFinance from '../../components/admin/pages/AdminFinance';
import AdminSettings from '../../components/admin/pages/AdminSettings';
import AdminBg from '../../assets/Admin.png';

const AdminPortal = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <AdminOverview />;
            case 'users':
                return <AdminUsers />;
            case 'logs':
                return <AdminLogs />;
            case 'finance':
                return <AdminFinance />;
            case 'settings':
                return <AdminSettings />;
            default:
                return <AdminOverview />;
        }
    };

    return (
        <AdminProvider>
            <div className="doctor-portal-container" style={{
                backgroundImage: `url(${AdminBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                minHeight: '100vh'
            }}>
                <AdminSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <main className="doctor-main" style={{ background: 'transparent' }}>
                    {renderContent()}
                </main>
            </div>
        </AdminProvider>
    );
};

export default AdminPortal;
