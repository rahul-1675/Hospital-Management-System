import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    LayoutDashboard, Calendar, Users, Settings, LogOut, FileText, Pill,
    ClipboardList, User, Activity, Menu, X
} from 'lucide-react';

const Sidebar = ({ role }) => {
    const { logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false); // Mobile state

    const getLinks = (role) => {
        switch (role) {
            case 'admin':
                return [
                    { name: 'Overview', path: '/portal/admin', icon: LayoutDashboard },
                    { name: 'Staff Management', path: '/portal/admin/staff', icon: Users },
                    { name: 'System Settings', path: '/portal/admin/settings', icon: Settings },
                ];
            case 'doctor':
                return [
                    { name: 'Dashboard', path: '/portal/doctor', icon: LayoutDashboard },
                    { name: 'Appointments', path: '/portal/doctor/appointments', icon: Calendar },
                    { name: 'My Patients', path: '/portal/doctor/patients', icon: Users },
                    { name: 'Prescriptions', path: '/portal/doctor/prescriptions', icon: FileText },
                ];
            case 'patient':
                return [
                    { name: 'Dashboard', path: '/portal/patient', icon: LayoutDashboard },
                    { name: 'My Appointments', path: '/portal/patient/appointments', icon: Calendar },
                    { name: 'Medical Records', path: '/portal/patient/records', icon: FileText },
                ];
            case 'receptionist':
                return [
                    { name: 'Dashboard', path: '/portal/receptionist', icon: LayoutDashboard },
                    { name: 'Patient Registration', path: '/portal/receptionist/register', icon: User },
                    { name: 'Queue', path: '/portal/receptionist/queue', icon: Users },
                ];
            case 'staff':
                return [
                    { name: 'Dashboard', path: '/portal/staff', icon: LayoutDashboard },
                    { name: 'Shift Schedule', path: '/portal/staff/schedule', icon: Calendar },
                ];
            default:
                return [];
        }
    };

    const links = getLinks(role);

    return (
        <>
            {/* Mobile Toggle */}
            <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow border border-gray-200"
                style={{ display: 'none' /* Handled by media query in CSS naturally if we had it, but for now we rely on sidebar class logic or just hide it since strict css is requested */ }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu />
            </button>

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity color="var(--primary-color)" />
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>HMS Portal</span>
                </div>

                <nav style={{ padding: '1rem' }}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {links.map((link) => {
                            const Icon = link.icon;
                            // Check if path is active (simple check)
                            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');

                            return (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0.75rem 1rem',
                                            borderRadius: 'var(--border-radius)',
                                            backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                                            color: isActive ? 'var(--primary-color)' : 'var(--muted-text)',
                                            fontWeight: isActive ? 600 : 500
                                        }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon size={20} style={{ marginRight: '0.75rem' }} />
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '0.75rem',
                            color: 'var(--danger-color)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        <LogOut size={20} style={{ marginRight: '0.75rem' }} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
