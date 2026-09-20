import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageLoader } from './Loader';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated, authReady } = useAuth();
    const location = useLocation();

    // Fix 3: Harden Route Guard
    if (!authReady) return <PageLoader text="Authenticating session..." minHeight="100vh" />;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Harden Role Guard & Normalization check with role synonyms
    if (allowedRoles && allowedRoles.length > 0) {
        const normalize = (r) => {
            if (!r) return '';
            const upper = r.toUpperCase().trim();
            if (upper === 'RECEPTION' || upper === 'RECEPTIONIST') return 'RECEPTIONIST';
            if (upper === 'PHARMACY' || upper === 'PHARMACIST') return 'PHARMACY';
            if (upper === 'STAFF' || upper === 'NURSE' || upper === 'WARD') return 'STAFF';
            if (upper === 'DOCTOR' || upper === 'DOC') return 'DOCTOR';
            if (upper === 'ADMIN' || upper === 'ADMINISTRATOR') return 'ADMIN';
            return upper;
        };

        const userRole = normalize(user?.role);
        const hasPermission = allowedRoles.some(role => normalize(role) === userRole);

        if (!hasPermission) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
