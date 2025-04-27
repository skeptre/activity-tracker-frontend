import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
authApi.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('session_token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await authApi.post<AuthResponse>('/auth/login', credentials);
        await AsyncStorage.setItem('session_token', response.data.session_token);
        return response.data;
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await authApi.post<AuthResponse>('/auth/register', credentials);
        await AsyncStorage.setItem('session_token', response.data.session_token);
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await authApi.post('/auth/logout');
        } finally {
            await AsyncStorage.removeItem('session_token');
        }
    },

    async getCurrentUser(): Promise<AuthResponse> {
        const response = await authApi.get<AuthResponse>('/auth/me');
        return response.data;
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await AsyncStorage.getItem('session_token');
        return !!token;
    },
}; 