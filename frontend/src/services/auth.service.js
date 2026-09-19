import { apiClient } from './api';

export const CREDENTIALS = {
    doctor: {
        id: "DOC001",
        password: "doc@123",
        name: "Dr. Smith",
        role: "doctor"
    },
    receptionist: {
        id: "REC001",
        password: "rec@123",
        name: "Receptionist Jane",
        role: "receptionist"
    },
    pharmacy: {
        id: "PHA001",
        password: "pha@123",
        name: "Pharmacist Bob",
        role: "pharmacy"
    },
    staff: {
        id: "STF001",
        password: "stf@123",
        name: "Staff Member Mike",
        role: "staff"
    },
    admin: {
        id: "ADM001",
        password: "admin@123",
        name: "Admin Alice",
        role: "admin"
    }
};

export const authService = {
    login: async (role, id, password) => {
        try {
            const res = await apiClient.post('/auth/login', { role, id, password });
            if (res.success && res.user) {
                if (res.token) {
                    localStorage.setItem('hms_auth_token', res.token);
                }
                return res.user;
            }
        } catch (apiError) {
            console.warn('Backend login unavailable or failed, checking local credentials fallback...', apiError.message);
        }

        // Fallback for offline/standalone execution
        await new Promise(resolve => setTimeout(resolve, 300));
        const user = CREDENTIALS[role];

        if (!user) {
            throw new Error("Invalid role selected");
        }

        if (user.id === id && user.password === password) {
            const { password: _, ...safeUser } = user;
            return safeUser;
        }

        throw new Error("Invalid ID or Password");
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout', {});
        } catch (err) {
            console.warn('Backend logout failed:', err.message);
        } finally {
            localStorage.removeItem('hms_auth_token');
        }
        return true;
    }
};
