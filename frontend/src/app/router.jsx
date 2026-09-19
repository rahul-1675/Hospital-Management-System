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
            { path: 'patient', element: <PatientPortal /> },
            // { path: 'patient/form', element: <PatientForm /> }, // Moved to top level for no layout
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/unauthorized',
        element: <Unauthorized />,
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
                element: <Navigate to="/login" replace />,
            },
            {
                path: 'admin',
                element: (
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPortal />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'doctor',
                element: (
                    <ProtectedRoute allowedRoles={['doctor']}>
                        <DoctorPortal />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'receptionist',
                element: (
                    <ProtectedRoute allowedRoles={['receptionist']}>
                        <ReceptionistPortal />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'pharmacy',
                element: (
                    <ProtectedRoute allowedRoles={['pharmacy']}>
                        <PharmacyPortal />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'staff',
                element: (
                    <ProtectedRoute allowedRoles={['staff']}>
                        <StaffPortal />
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
