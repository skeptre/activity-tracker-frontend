export interface Activity {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime?: Date;
    status: 'pending' | 'in_progress' | 'completed';
    category: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
}

export interface HomeState {
    activities: Activity[];
    isLoading: boolean;
    error: string | null;
    selectedDate: Date;
} 