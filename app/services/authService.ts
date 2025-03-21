import Config from "@/app/constants/Config";
import { User } from "@/app/models/UserModel";
import { AuthResponse } from "@/app/models/AuthResponse";

// ✅ REGISTER: Create an account
const register = async (userData: User): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${Config.BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Signup failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
};

// ✅ LOGIN: Authenticate user & get token
const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${Config.BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        return await response.json(); // Should return { token, user }
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

// ✅ LOGOUT: Remove session on the backend
const logout = async (): Promise<void> => {
    try {
        const response = await fetch(`${Config.BASE_URL}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Logout failed: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};

// ✅ EXPORT AS OBJECT
const AuthService = { register, login, logout };
export default AuthService;