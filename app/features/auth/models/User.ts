export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
} 