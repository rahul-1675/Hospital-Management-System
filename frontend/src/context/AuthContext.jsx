import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("hms_token");
        const role = localStorage.getItem("hms_role");
        const storedUser = localStorage.getItem("hms_user");

        if (token && role && storedUser) {
            try {
                setUser({ ...JSON.parse(storedUser), role }); // Ensure role is synced
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Failed to parse stored user", error);
                localStorage.removeItem("hms_user");
                localStorage.removeItem("hms_role");
                localStorage.removeItem("hms_token");
            }
        }
        setAuthReady(true);
    }, []);

    const login = async (role, id, password) => {
        try {
            const userData = await authService.login(role, id, password);

            // FIX 1: ROLE NORMALIZATION
            const normalizedRole = userData.role.toUpperCase(); // Assuming authService returns role in userData

            // Ensure authService returned a role, if not use the requested one
            const finalRole = normalizedRole || role.toUpperCase();

            // Mock Token (since authService might not return one)
            const token = "mock-jwt-token-12345";

            const safeUser = { ...userData, role: finalRole };

            setUser(safeUser);
            setIsAuthenticated(true);

            // Store separate items as requested
            localStorage.setItem("hms_user", JSON.stringify(safeUser));
            localStorage.setItem("hms_role", finalRole);
            localStorage.setItem("hms_token", token);

            return { success: true, role: finalRole };
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
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, authReady, isAuthenticated }}>
            {authReady && children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
