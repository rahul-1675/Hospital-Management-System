import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/doctor-portal.css';
import DoctorBg from '../../assets/Doctor.jpg';
import DoctorSidebar from '../../components/doctor/layout/DoctorSidebar';
import DoctorDashboard from '../../components/doctor/pages/DoctorDashboard';
import DoctorAppointments from '../../components/doctor/pages/DoctorAppointments';
import DoctorPatients from '../../components/doctor/pages/DoctorPatients';
import DoctorMedicalRecords from '../../components/doctor/pages/DoctorMedicalRecords';
import DoctorProfile from '../../components/doctor/pages/DoctorProfile';
import { doctorService } from '../../services/doctor.service';

const DoctorPortal = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const data = await doctorService.getPortalAppointments();
            setAppointments(data);
        } catch (err) {
            console.error('Failed to load portal appointments:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DoctorDashboard setActiveTab={setActiveTab} onRefresh={fetchAppointments} />;
            case 'appointments':
                return <DoctorAppointments appointments={appointments} setAppointments={setAppointments} onRefresh={fetchAppointments} loading={loading} />;
            case 'patients':
                return <DoctorPatients />;
            case 'records':
                return <DoctorMedicalRecords />;
            case 'profile':
                return <DoctorProfile />;
            default:
                return <DoctorDashboard setActiveTab={setActiveTab} onRefresh={fetchAppointments} />;
        }
    };

    return (
        <div className="doctor-portal-container" style={{
            backgroundImage: `url(${DoctorBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <DoctorSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
            />
            <main className="doctor-main">
                {renderContent()}
            </main>
        </div>
    );
};

export default DoctorPortal;

