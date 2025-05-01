import axios from 'axios';
import type { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';
import { SignUpFormData, UserProfile } from '../types/auth';
import { Config } from '../../../constants/constants';
import { Platform } from 'react-native';

// Use the Config from constants
const API_URL = Config.BASE_URL;

const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout configuration
    timeout: 10000, // 10 seconds
    // Add additional headers for Android if needed
    ...(Platform.OS === 'android' ? {
        headers: {
            'Accept': 'application/json',
        }
    } : {})
});

// Add response interceptor for better error handling
authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timed out. Please check your internet connection.');
        }
        
        if (!error.response) {
            throw new Error('Network error. Please check your internet connection and try again.');
        }
        
        // Handle specific error cases
        switch (error.response.status) {
            case 401:
                throw new Error('Invalid credentials. Please check your email and password.');
            case 404:
                throw new Error('Server not found. Please check the API configuration.');
            case 500:
                throw new Error('Server error. Please try again later.');
            default:
                throw error;
        }
    }
);

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await authApi.post<{ user_id: number; session_token: string }>(
            '/users/login',
            credentials
        );
        await AsyncStorage.setItem('session_token', response.data.session_token);
        return {
            user: { id: response.data.user_id, first_name: '', last_name: '', email: credentials.email },
            session_token: response.data.session_token,
        };
    },

    async register(credentials: RegisterCredentials): Promise<{ user_id: number }> {
        const response = await authApi.post<{ user_id: number }>(
            '/users',
            credentials
        );
        return response.data;
    },

    async logout(): Promise<void> {
        const token = await AsyncStorage.getItem('session_token');
        if (!token) return;
        try {
            await authApi.post('/users/logout', {}, {
                headers: { 'X-Authorization': token },
            });
        } finally {
            await AsyncStorage.removeItem('session_token');
        }
    },

    async getCurrentUser(): Promise<AuthResponse> {
        // Not implemented in backend, so just return null or throw
        throw new Error('Not implemented');
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await AsyncStorage.getItem('session_token');
        return !!token;
    },
};

export const signUpService = async (data: Omit<SignUpFormData, 'confirmPassword'>): Promise<UserProfile> => {
    try {
        console.log('Attempting to sign up user:', data.email);
        console.log('API URL:', API_URL);
        
        // Add platform-specific logging
        if (__DEV__) {
            console.log('Platform:', Platform.OS);
            console.log('API Configuration:', {
                baseURL: authApi.defaults.baseURL,
                timeout: authApi.defaults.timeout,
                headers: authApi.defaults.headers,
            });
        }
        
        // Convert from our form structure to the API expected format
        const credentials: RegisterCredentials = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password
        };

        // Use the actual API service to register the user
        const response = await authService.register(credentials);
        
        console.log('Backend registration response:', response);
        
        // Return a user profile based on the registration data
        return {
            id: response.user_id.toString(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            createdAt: new Date().toISOString(),
        };
    } catch (err: unknown) {
        const error = err as AxiosError;
        console.error('Sign up error:', error);
        // Enhanced error logging
        if (error.isAxiosError) {
            console.error('Network Error Details:', {
                message: error.message,
                code: error.code,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers,
                },
                response: error.response?.data,
            });
        }
        throw error;
    }
};

export const signInService = async (email: string, password: string): Promise<UserProfile> => {
    try {
        console.log('Attempting to sign in user:', email);
        console.log('API URL:', API_URL);
        
        // Add platform-specific logging
        if (__DEV__) {
            console.log('Platform:', Platform.OS);
            console.log('API Configuration:', {
                baseURL: authApi.defaults.baseURL,
                timeout: authApi.defaults.timeout,
                headers: authApi.defaults.headers,
            });
        }
        
        // Use the actual API service to login
        const response = await authService.login({ email, password });
        
        console.log('Backend login response:', response);

        // Fetch user details if needed
        // For now, we'll use the available info from the login response
        return {
            id: response.user.id.toString(),
            firstName: response.user.first_name || 'User',
            lastName: response.user.last_name || '',
            email: response.user.email,
            createdAt: new Date().toISOString(),
        };
    } catch (err: unknown) {
        const error = err as AxiosError;
        console.error('Sign in error:', error);
        // Enhanced error logging
        if (error.isAxiosError) {
            console.error('Network Error Details:', {
                message: error.message,
                code: error.code,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers,
                },
                response: error.response?.data,
            });
        }
        throw error;
    }
}; 