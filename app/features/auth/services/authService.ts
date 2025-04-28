import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';
import { SignUpFormData, UserProfile } from '../types/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333';

const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await authApi.post<{ user_id: number; session_token: string }>(
            '/api/users/login',
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
            '/api/users',
            credentials
        );
        return response.data;
    },

    async logout(): Promise<void> {
        const token = await AsyncStorage.getItem('session_token');
        if (!token) return;
        try {
            await authApi.post('/api/users/logout', {}, {
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

export const signUpService = async (data: SignUpFormData): Promise<UserProfile> => {
    try {
        // Mock implementation
        return {
            id: 'user_123',
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            username: data.username,
            createdAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
};

export const signInService = async (email: string, password: string): Promise<UserProfile> => {
    try {
        // Mock implementation
        return {
            id: 'user_123',
            firstName: 'John',
            lastName: 'Doe',
            email: email,
            createdAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
}; 