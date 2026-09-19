import React, { useState } from 'react';
import StaffSidebar from '../../components/staff/layout/StaffSidebar';
import StaffTasks from '../../components/staff/pages/StaffTasks';
import StaffSchedule from '../../components/staff/pages/StaffSchedule';
import StaffProfile from '../../components/staff/pages/StaffProfile';
import { StaffProvider } from '../../context/StaffContext';

const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState('tasks');

    const renderContent = () => {
        switch (activeTab) {
            case 'tasks':
                return <StaffTasks />;
            case 'schedule':
                return <StaffSchedule />;
            case 'profile':
                return <StaffProfile />;
            default:
                return <StaffTasks />;
        }
    };

    return (
        <StaffProvider>
            <div className="doctor-dashboard-container" style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
                <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    {renderContent()}
                </main>
            </div>
        </StaffProvider>
    );
};

export default StaffDashboard;
