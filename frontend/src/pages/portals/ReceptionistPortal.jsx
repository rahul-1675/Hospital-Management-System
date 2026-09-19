import React, { useState } from 'react';
import bgImage from '../../assets/Reception.jpeg';
import '../../styles/receptionist-portal.css';
import ReceptionSidebar from '../../components/receptionist/layout/ReceptionSidebar';
import ReceptionDashboard from '../../components/receptionist/pages/ReceptionDashboard';
import ReceptionAppointments from '../../components/receptionist/pages/ReceptionAppointments';
import ReceptionRegistration from '../../components/receptionist/pages/ReceptionRegistration';
import ReceptionQueue from '../../components/receptionist/pages/ReceptionQueue';

import ReceptionBilling from '../../components/receptionist/pages/ReceptionBilling';
import ReceptionProfile from '../../components/receptionist/pages/ReceptionProfile';
import { ReceptionProvider } from '../../context/ReceptionContext';

// Placeholder components for missing pages
const PlaceholderPage = ({ title }) => (
    <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--reception-text-muted)', flexDirection: 'column', gap: '1rem' }}>
        <h2>{title}</h2>
        <p>This module is currently under development.</p>
    </div>
);


const ReceptionistPortal = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <ReceptionDashboard setActiveTab={setActiveTab} />;
            case 'appointments':
                return <ReceptionAppointments />;
            case 'registration':
                return <ReceptionRegistration />;
            case 'queue':
                return <ReceptionQueue />;
            case 'billing':
                return <ReceptionBilling />;
            case 'profile':
                return <ReceptionProfile />;
            default:
                return <ReceptionDashboard setActiveTab={setActiveTab} />;
        }
    };

    return (
        <ReceptionProvider>
            <div className="reception-portal-container" style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
                <ReceptionSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <main className="reception-main">
                    {renderContent()}
                </main>
            </div>
        </ReceptionProvider>
    );
};

export default ReceptionistPortal;
