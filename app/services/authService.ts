import api from "@/config/api";
import { User, UserLogin } from "../assets/types/types";

export const AuthService = {
  signUp: async (user: User) => {
    try {
      const response = await api.post("users", user);

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error(`Unexpected error code ${response.status}`);
      }
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error_message);
      } else {
        throw new Error("Network error. Please check your internet.");
      }
    }
  },
  login: async (userLogin: UserLogin) => {
    try {
      const response = await api.post("users/login", userLogin);

      if (response.status === 200) {
        return response.data.user_id;
      } else {
        throw new Error(`Unexpected error code ${response.status}`);
      }
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error_message);
      } else {
        throw new Error("Network error. Please check your internet.");
      }
    }
  },
  logout: async () => {
    try {
      const response = await api.post("users/logout");

      if (response.status === 200) {
        return response.data.message;
      } else {
        throw new Error(`Unexpected error code ${response.status}`);
      }
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error_message);
      } else {
        throw new Error("Network error. Please check your internet.");
      }
    }
  },
};
