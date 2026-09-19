import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../hooks/useAuth';

const DashboardLayout = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="dashboard-layout">
            <Sidebar role={user.role} />
            <main className="dashboard-content">
                <div className="container">
                    {/* Header could go here */}
                    <header className="dashboard-header flex justify-between items-center">
                        <div>
                            <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{user.role} Portal</h2>
                            <p>Welcome back, {user.name}</p>
                        </div>
                        <div className="flex items-center gap-md">
                            {/* User Profile / Actions */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
