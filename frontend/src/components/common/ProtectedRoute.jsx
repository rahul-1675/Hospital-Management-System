import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated, authReady } = useAuth();
    const location = useLocation();

    // Fix 3: Harden Route Guard
    if (!authReady) return null; // Or a loading spinner

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Fix 4: Harden Role Guard & Normalization check
    // We compare Uppercase to Uppercase to be safe
    if (allowedRoles) {
        const userRole = user?.role?.toUpperCase();
        const hasPermission = allowedRoles.some(role => role.toUpperCase() === userRole);

        if (!hasPermission) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
