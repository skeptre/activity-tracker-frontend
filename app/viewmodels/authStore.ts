import { useState } from "react";
import { AuthService } from "../services/authService";
import { User, UserLogin } from "../assets/types/types";

export const SignUpViewModel = () => {
  const [progress, setProgress] = useState({
    loading: false,
    error: "",
    success: false,
  });

  const signUp = async (form: User) => {
    try {
      resetState();
      await AuthService.signUp(form);
      setProgress((prev) => ({
        ...prev,
        success: true,
      }));
    } catch (e: any) {
      setProgress((prev) => ({
        ...prev,
        error: e.message,
      }));
    } finally {
      setProgress((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const login = async (form: UserLogin) => {
    try {
      resetState();
      await AuthService.login(form);
      setProgress((prev) => ({
        ...prev,
        success: true,
      }));
    } catch (e: any) {
      setProgress((prev) => ({
        ...prev,
        error: e.message,
      }));
    } finally {
      setProgress((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const logout = async () => {
    try {
      resetState();
      await AuthService.logout();
      setProgress((prev) => ({
        ...prev,
        success: true,
      }));
    } catch (e: any) {
      setProgress((prev) => ({
        ...prev,
        error: e.message,
      }));
    } finally {
      setProgress((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const resetState = () => {
    setProgress({
      loading: false,
      error: "",
      success: false,
    });
  };

  return { signUp, login, logout, progress };
};
