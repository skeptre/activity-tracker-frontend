import { makeAutoObservable, runInAction } from 'mobx';
import { User, AuthState } from '../models/User';
import { authService } from '../services/authService';
import { UserProfile } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing user data in AsyncStorage
const USER_STORAGE_KEY = 'user_data';

class AuthViewModel {
    private state: AuthState = {
        user: null,
        isLoading: true, // Start with loading state
        error: null
    };

    private authStateListeners: ((user: User | null) => void)[] = [];

    constructor() {
        makeAutoObservable(this);
        // Load saved user data on startup
        this.loadSavedUserData();
    }

    // Load user data from AsyncStorage on app startup
    private async loadSavedUserData(): Promise<void> {
        try {
            // First check if we have a session token
            const token = await AsyncStorage.getItem('session_token');
            if (!token) {
                runInAction(() => {
                    this.state.isLoading = false;
                });
                return;
            }

            // Try to load user data
            const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
            if (userData) {
                const user = JSON.parse(userData);
                runInAction(() => {
                    this.state.user = {
                        ...user,
                        createdAt: new Date(user.createdAt),
                        updatedAt: new Date(user.updatedAt)
                    };
                    this.notifyAuthStateListeners();
                });
            }
        } catch (error) {
            console.error('Error loading saved user data:', error);
        } finally {
            runInAction(() => {
                this.state.isLoading = false;
            });
        }
    }

    get user(): User | null {
        return this.state.user;
    }

    get isLoading(): boolean {
        return this.state.isLoading;
    }

    get error(): string | null {
        return this.state.error;
    }

    setUser(userProfile: UserProfile): void {
        runInAction(() => {
            // Convert UserProfile to User
            const user = {
                id: userProfile.id,
                email: userProfile.email,
                name: `${userProfile.firstName} ${userProfile.lastName}`,
                createdAt: new Date(userProfile.createdAt),
                updatedAt: new Date() // Use current date for updatedAt since it's not in UserProfile
            };
            
            this.state.user = user;
            this.notifyAuthStateListeners();
            
            // Persist user data to AsyncStorage
            this.saveUserData(user);
        });
    }

    // Save user data to AsyncStorage
    private async saveUserData(user: User): Promise<void> {
        try {
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    onAuthStateChanged(listener: (user: User | null) => void): () => void {
        this.authStateListeners.push(listener);
        return () => {
            this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
        };
    }

    private notifyAuthStateListeners(): void {
        this.authStateListeners.forEach(listener => listener(this.state.user));
    }

    async login(email: string, password: string): Promise<void> {
        runInAction(() => {
            this.state.isLoading = true;
            this.state.error = null;
        });
        try {
            // TODO: Implement actual login logic here
            // const response = await authService.login(email, password);
            // runInAction(() => {
            //     this.state.user = response.user;
            //     this.notifyAuthStateListeners();
            // });
        } catch (error) {
            runInAction(() => {
                this.state.error = error instanceof Error ? error.message : 'An error occurred';
            });
        } finally {
            runInAction(() => {
                this.state.isLoading = false;
            });
        }
    }

    async signUp(first_name: string, last_name: string, email: string, password: string): Promise<void> {
        runInAction(() => {
            this.state.isLoading = true;
            this.state.error = null;
        });
        try {
            await authService.register({ first_name, last_name, email, password });
            // Optionally, you can auto-login or navigate after registration
        } catch (error) {
            runInAction(() => {
                this.state.error = error instanceof Error ? error.message : 'An error occurred';
            });
        } finally {
            runInAction(() => {
                this.state.isLoading = false;
            });
        }
    }

    logout(): void {
        // Clear user from state
        this.state.user = null;
        this.state.error = null;
        this.notifyAuthStateListeners();
        
        // Remove user data from AsyncStorage
        this.clearUserData();
    }
    
    // Clear user data from AsyncStorage
    private async clearUserData(): Promise<void> {
        try {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            // The session token is already removed in authService.logout()
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    }
}

export const authViewModel = new AuthViewModel(); 