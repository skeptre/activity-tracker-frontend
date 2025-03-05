import React, { useState, useEffect, createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { login as apiLogin, logout as apiLogout } from "../Services/authService";

interface User {
    token: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                setUser({ token });  // Replace with actual user data if needed
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await apiLogin(email, password);
        if (data.token) {
            await SecureStore.setItemAsync("token", data.token);
            setUser({ token: data.token });
        }
    };

    const logout = async () => {
        await apiLogout();
        await SecureStore.deleteItemAsync("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
