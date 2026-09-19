import React, { useState } from 'react';
import '../../styles/doctor-portal.css';
import StaffBg from '../../assets/Staff.jpg';
import StaffSidebar from '../../components/staff/layout/StaffSidebar';
import StaffDashboard from '../../components/staff/pages/StaffDashboard';
import StaffTasks from '../../components/staff/pages/StaffTasks';
import StaffSchedule from '../../components/staff/pages/StaffSchedule';
import StaffProfile from '../../components/staff/pages/StaffProfile';
import { StaffProvider } from '../../context/StaffContext';

const StaffPortal = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <StaffDashboard setActiveTab={setActiveTab} />;
            case 'tasks':
                return <StaffTasks />;
            case 'schedule':
                return <StaffSchedule />;
            case 'profile':
                return <StaffProfile />;
            default:
                return <StaffDashboard setActiveTab={setActiveTab} />;
        }
    };

    return (
        <StaffProvider>
            <div className="doctor-portal-container" style={{
                backgroundImage: `url(${StaffBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
                <StaffSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <main className="doctor-main">
                    {renderContent()}
                </main>
            </div>
        </StaffProvider>
    );
};

export default StaffPortal;
