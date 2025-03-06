import React, { useState, useEffect, createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { login as apiLogin, logout as apiLogout } from "@/app/services/authService"; // Ensure correct import path
import { Platform } from "react-native";

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
            if (Platform.OS !== "web") {
                try {
                    const token = await SecureStore.getItemAsync("token");
                    if (token) {
                        setUser({ token });
                    }
                } catch (error) {
                    console.error("Error checking auth status:", error);
                }
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const data = await apiLogin(email, password);
            if (data.token) {
                await SecureStore.setItemAsync("token", data.token);
                setUser({ token: data.token });
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            await SecureStore.deleteItemAsync("token");
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: user !== null && Boolean(user.token), login, logout, loading }}>
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
