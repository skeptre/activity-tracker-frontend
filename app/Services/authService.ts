import { API_URL } from "../constants/Config"; // Ensure this file exists or hardcode URL

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Invalid credentials");
        }

        return await response.json();
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Logout error:", error);
    }
};
