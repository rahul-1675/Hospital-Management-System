import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="page-wrapper flex items-center justify-center bg-gray-100" style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '480px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
