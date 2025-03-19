import { useState } from "react";
import AuthService from "@/app/services/authService";
import { User } from "@/app/models/UserModel";

export const SignUpViewModel = () => {
    const [loading, setLoading] = useState(false);

    const signUp = async (userData: User) => {
        setLoading(true);
        try {
            const response = await AuthService.register(userData);
            console.log("Sign Up successful", response);
        } catch (error) {
            console.error("Sign Up failed", error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await AuthService.login(email, password);
            console.log("Login successful", response);
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await AuthService.logout();
            console.log("Logout successful");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setLoading(false);
        }
    };

    return { signUp, signIn, signOut, loading };
};

export default SignUpViewModel;