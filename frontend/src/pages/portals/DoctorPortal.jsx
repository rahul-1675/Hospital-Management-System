import React, { useState } from 'react';
import '../../styles/doctor-portal.css';
import DoctorBg from '../../assets/Doctor.jpg';
import DoctorSidebar from '../../components/doctor/layout/DoctorSidebar';
import DoctorDashboard from '../../components/doctor/pages/DoctorDashboard';
import DoctorAppointments from '../../components/doctor/pages/DoctorAppointments';
import DoctorPatients from '../../components/doctor/pages/DoctorPatients';
import DoctorMedicalRecords from '../../components/doctor/pages/DoctorMedicalRecords';
import DoctorProfile from '../../components/doctor/pages/DoctorProfile';

const initialAppointments = [
    {
        id: 1,
        time: '09:00 AM',
        patientName: 'Sarah Johnson',
        age: 28,
        gender: 'Female',
        reason: 'Severe migraine and sensitivity to light',
        status: 'checked-in',
        history: 'Last visit: 3 months ago (Routine Checkup)',
        vitals: 'BP: 120/80',
        pastVisits: [
            { date: '2023-11-15', doctor: 'Dr. Smith', diagnosis: 'Routine Checkup', prescription: 'None' },
            { date: '2023-08-10', doctor: 'Dr. Lee', diagnosis: 'Mild Fever', prescription: 'Paracetamol' }
        ],
        notes: ''
    },
    {
        id: 2,
        time: '09:30 AM',
        patientName: 'Michael Chen',
        age: 45,
        gender: 'Male',
        reason: 'Follow-up for hypertension',
        status: 'in-consultation',
        history: 'Last visit: 1 week ago (Hypertension)',
        vitals: 'BP: 140/90',
        pastVisits: [
            { date: '2024-01-20', doctor: 'Dr. Smith', diagnosis: 'Hypertension', prescription: 'Amlodipine 5mg' }
        ],
        notes: 'Patient reports feeling better. BP is slightly high.'
    },
    {
        id: 3,
        time: '10:00 AM',
        patientName: 'Emma Davis',
        age: 32,
        gender: 'Female',
        reason: 'Annual physical examination',
        status: 'completed',
        history: 'Last visit: 1 year ago',
        vitals: 'BP: 118/76',
        pastVisits: [],
        notes: 'All vitals normal. Patient advised to maintain diet.'
    },
    {
        id: 4,
        time: '10:45 AM',
        patientName: 'James Wilson',
        age: 60,
        gender: 'Male',
        reason: 'Joint pain in left knee',
        status: 'pending',
        history: 'Last visit: 2 weeks ago',
        vitals: 'BP: 130/85',
        pastVisits: [],
        notes: ''
    }
];

const DoctorPortal = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [appointments, setAppointments] = useState(initialAppointments);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DoctorDashboard setActiveTab={setActiveTab} />;
            case 'appointments':
                return <DoctorAppointments appointments={appointments} setAppointments={setAppointments} />;
            case 'patients':
                return <DoctorPatients />;
            case 'records':
                return <DoctorMedicalRecords />;
            case 'profile':
                return <DoctorProfile />;
            default:
                return <DoctorDashboard setActiveTab={setActiveTab} />;
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
