import { makeAutoObservable, runInAction } from 'mobx';
import { User, AuthState } from '../models/User';
import { authService } from '../services/authService';

class AuthViewModel {
    private state: AuthState = {
        user: null,
        isLoading: false,
        error: null
    };

    private authStateListeners: ((user: User | null) => void)[] = [];

    constructor() {
        makeAutoObservable(this);
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
        this.state.user = null;
        this.state.error = null;
        this.notifyAuthStateListeners();
    }
}

export const authViewModel = new AuthViewModel(); 