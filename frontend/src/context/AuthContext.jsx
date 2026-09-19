import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("hms_auth_token") || localStorage.getItem("hms_token");
            const storedUser = localStorage.getItem("hms_user");

            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);

                    // Background session verification
                    const verifiedUser = await authService.getCurrentUser();
                    if (verifiedUser) {
                        const role = (verifiedUser.role || 'patient').toUpperCase();
                        const syncedUser = { ...verifiedUser, role };
                        setUser(syncedUser);
                        localStorage.setItem("hms_user", JSON.stringify(syncedUser));
                        localStorage.setItem("hms_role", role);
                    }
                } catch (error) {
                    console.error("Failed to parse stored user", error);
                    localStorage.removeItem("hms_user");
                    localStorage.removeItem("hms_role");
                    localStorage.removeItem("hms_token");
                    localStorage.removeItem("hms_auth_token");
                }
            }
            setAuthReady(true);
        };

        initAuth();
    }, []);

    const login = async (arg1, arg2, arg3) => {
        try {
            let role, identifier, password;
            if (arg3 !== undefined) {
                role = arg1;
                identifier = arg2;
                password = arg3;
            } else {
                identifier = arg1;
                password = arg2;
            }

            const userData = await authService.login(role, identifier, password);

            // Normalized uppercase role for client routing based on user's actual role from credentials
            const normalizedRole = (userData.role || role || 'PATIENT').toUpperCase();
            const safeUser = { ...userData, role: normalizedRole };

            setUser(safeUser);
            setIsAuthenticated(true);

            localStorage.setItem("hms_user", JSON.stringify(safeUser));
            localStorage.setItem("hms_role", normalizedRole);

            return { success: true, role: normalizedRole, user: safeUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("hms_user");
        localStorage.removeItem("hms_role");
        localStorage.removeItem("hms_token");
        localStorage.removeItem("hms_auth_token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, authReady, isAuthenticated }}>
            {authReady && children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
