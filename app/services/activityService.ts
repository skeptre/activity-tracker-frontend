import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from '../features/home/models/Activity';

// Define our own simplified AxiosRequestConfig type
interface RequestConfig {
  headers?: Record<string, string>;
  [key: string]: any;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333';

const activityApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Use a simpler approach - provide direct header instead of async operation
activityApi.interceptors.request.use((config: RequestConfig) => {
    // We can't use AsyncStorage directly in interceptors because it's async
    // But we can ensure our headers are properly typed
    if (config.headers) {
        // Token will be loaded before request is made via setAuthHeaderForRequest
        // This just ensures the config object is properly handled for TypeScript
    }
    return config;
}, (error: any) => {
    return Promise.reject(error);
});

// This is the function you should call before making API requests
export const setAuthHeaderForRequest = async (config: RequestConfig) => {
    const token = await AsyncStorage.getItem('session_token');
    if (token && config?.headers) {
        config.headers['X-Authorization'] = token;
    }
    return config;
};

export const activityService = {
    // Apply authentication before making requests
    async getActivities(): Promise<Activity[]> {
        try {
            // Prepare request config
            const config = await setAuthHeaderForRequest({});
            
            // For now, return mock data since backend might not be implemented
            return mockActivities;
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    },

    async createActivity(activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
        try {
            // Mock implementation until backend is ready
            const newActivity: Activity = {
                ...activityData,
                id: `activity_${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            mockActivities.push(newActivity);
            return newActivity;
        } catch (error) {
            console.error('Error creating activity:', error);
            throw error;
        }
    },

    async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity> {
        try {
            // Mock implementation
            const index = mockActivities.findIndex(a => a.id === id);
            if (index === -1) {
                throw new Error('Activity not found');
            }
            
            const updatedActivity = {
                ...mockActivities[index],
                ...updates,
                updatedAt: new Date()
            };
            
            mockActivities[index] = updatedActivity;
            return updatedActivity;
        } catch (error) {
            console.error('Error updating activity:', error);
            throw error;
        }
    },

    async deleteActivity(id: string): Promise<void> {
        try {
            // Mock implementation
            const index = mockActivities.findIndex(a => a.id === id);
            if (index === -1) {
                throw new Error('Activity not found');
            }
            
            mockActivities.splice(index, 1);
        } catch (error) {
            console.error('Error deleting activity:', error);
            throw error;
        }
    },
    
    async startActivity(id: string): Promise<Activity> {
        return this.updateActivity(id, {
            status: 'in_progress',
            startTime: new Date()
        });
    },
    
    async stopActivity(id: string): Promise<Activity> {
        return this.updateActivity(id, {
            status: 'completed',
            endTime: new Date()
        });
    }
};

// Mock data for development
const mockActivities: Activity[] = [
    {
        id: 'activity_1',
        title: 'Morning Exercise',
        description: 'Daily workout routine',
        startTime: new Date(2023, 5, 15, 8, 0),
        endTime: new Date(2023, 5, 15, 9, 0),
        status: 'completed',
        category: 'Health',
        priority: 'high',
        createdAt: new Date(2023, 5, 14),
        updatedAt: new Date(2023, 5, 15)
    },
    {
        id: 'activity_2',
        title: 'Project Planning',
        description: 'Plan tasks for the new feature',
        startTime: new Date(2023, 5, 15, 10, 0),
        status: 'in_progress',
        category: 'Work',
        priority: 'medium',
        createdAt: new Date(2023, 5, 15),
        updatedAt: new Date(2023, 5, 15)
    },
    {
        id: 'activity_3',
        title: 'Read Book',
        description: 'Continue reading "Atomic Habits"',
        startTime: new Date(2023, 5, 16, 20, 0),
        status: 'pending',
        category: 'Personal',
        priority: 'low',
        createdAt: new Date(2023, 5, 14),
        updatedAt: new Date(2023, 5, 14)
    }
]; 