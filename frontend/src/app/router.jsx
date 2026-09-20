import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/common/ProtectedRoute'; // Updated import

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Feedback from '../pages/public/Feedback';
import PatientForm from '../pages/public/PatientForm'; // Future file

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import { useAuth } from '../hooks/useAuth';

// Portals
import AdminPortal from '../pages/portals/AdminPortal';
import DoctorPortal from '../pages/portals/DoctorPortal';
import ReceptionistPortal from '../pages/portals/ReceptionistPortal';
import StaffPortal from '../pages/portals/StaffPortal';
import PharmacyPortal from '../pages/portals/PharmacyPortal';
import PatientPortal from '../pages/portals/PatientPortal';

// Error Pages
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

// Smart redirect for /portal index
const PortalIndexRedirect = () => {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }
    const role = (user.role || '').toUpperCase();
    switch (role) {
        case 'ADMIN':
        case 'ADMINISTRATOR':
            return <Navigate to="/portal/admin" replace />;
        case 'DOCTOR':
        case 'DOC':
            return <Navigate to="/portal/doctor" replace />;
        case 'RECEPTION':
        case 'RECEPTIONIST':
            return <Navigate to="/portal/receptionist" replace />;
        case 'PHARMACY':
        case 'PHARMACIST':
            return <Navigate to="/portal/pharmacy" replace />;
        case 'STAFF':
        case 'NURSE':
        case 'WARD':
            return <Navigate to="/portal/staff" replace />;
        case 'PATIENT':
            return <Navigate to="/patient" replace />;
        default:
            return <Navigate to="/portal/admin" replace />;
    }
};

export const router = createBrowserRouter([
    {
        path: '/patient/form',
        element: <PatientForm />,
    },
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'feedback', element: <Feedback /> },
            { path: 'reviews', element: <Feedback /> },
            { path: 'patient', element: <PatientPortal /> },
            { path: 'doctors', element: <PatientPortal /> },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/unauthorized',
        element: <Unauthorized />,
    },
    {
        path: '/patient',
        element: (
            <PublicLayout>
                <PatientPortal />
            </PublicLayout>
        ),
    },
    {
        element: <AuthLayout />,
        children: [],
    },
    {
        path: '/portal',
        element: (
            <ProtectedRoute>
                <Outlet />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <PortalIndexRedirect />,
            },
            {
                path: 'admin',
                element: (
                    <ProtectedRoute allowedRoles={['admin', 'administrator']}>
                        <AdminPortal />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'doctor',
                element: (
                    <ProtectedRoute allowedRoles={['doctor', 'doc']}>
                        <DoctorPortal />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'receptionist',
                element: (
                    <ProtectedRoute allowedRoles={['receptionist', 'reception']}>
                        <ReceptionistPortal />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'pharmacy',
                element: (
                    <ProtectedRoute allowedRoles={['pharmacy', 'pharmacist']}>
                        <PharmacyPortal />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'staff',
                element: (
                    <ProtectedRoute allowedRoles={['staff', 'nurse', 'ward']}>
                        <StaffPortal />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'patient',
                element: (
                    <ProtectedRoute allowedRoles={['patient']}>
                        <PatientPortal />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);
