import { makeAutoObservable } from 'mobx';
import { Activity, HomeState } from '../models/Activity';
import { activityService } from '../../../services/activityService';

class HomeViewModel {
    private state: HomeState = {
        activities: [],
        isLoading: false,
        error: null,
        selectedDate: new Date()
    };

    constructor() {
        makeAutoObservable(this);
    }

    get activities(): Activity[] {
        return this.state.activities;
    }

    get isLoading(): boolean {
        return this.state.isLoading;
    }

    get error(): string | null {
        return this.state.error;
    }

    get selectedDate(): Date {
        return this.state.selectedDate;
    }

    setSelectedDate(date: Date): void {
        this.state.selectedDate = date;
        this.fetchActivities();
    }

    async fetchActivities(): Promise<void> {
        try {
            this.state.isLoading = true;
            this.state.error = null;
            
            // Use activityService to fetch activities
            const activities = await activityService.getActivities();
            this.state.activities = activities;
            
        } catch (error) {
            this.state.error = error instanceof Error ? error.message : 'An error occurred';
        } finally {
            this.state.isLoading = false;
        }
    }

    async createActivity(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
        try {
            this.state.isLoading = true;
            this.state.error = null;
            
            // Use activityService to create activity
            const newActivity = await activityService.createActivity(activity);
            this.state.activities.push(newActivity);
            
        } catch (error) {
            this.state.error = error instanceof Error ? error.message : 'An error occurred';
        } finally {
            this.state.isLoading = false;
        }
    }

    async updateActivity(id: string, updates: Partial<Activity>): Promise<void> {
        try {
            this.state.isLoading = true;
            this.state.error = null;
            
            // Use activityService to update activity
            const updatedActivity = await activityService.updateActivity(id, updates);
            const index = this.state.activities.findIndex(a => a.id === id);
            if (index !== -1) {
                this.state.activities[index] = updatedActivity;
            }
            
        } catch (error) {
            this.state.error = error instanceof Error ? error.message : 'An error occurred';
        } finally {
            this.state.isLoading = false;
        }
    }

    async deleteActivity(id: string): Promise<void> {
        try {
            this.state.isLoading = true;
            this.state.error = null;
            
            // Use activityService to delete activity
            await activityService.deleteActivity(id);
            this.state.activities = this.state.activities.filter(a => a.id !== id);
            
        } catch (error) {
            this.state.error = error instanceof Error ? error.message : 'An error occurred';
        } finally {
            this.state.isLoading = false;
        }
    }

    async startActivity(id: string): Promise<void> {
        try {
            this.state.isLoading = true;
            this.state.error = null;
            
            // Use activityService to start activity
            const updatedActivity = await activityService.startActivity(id);
            const index = this.state.activities.findIndex(a => a.id === id);
            if (index !== -1) {
                this.state.activities[index] = updatedActivity;
            }
            
        } catch (error) {
            this.state.error = error instanceof Error ? error.message : 'An error occurred';
        } finally {
            this.state.isLoading = false;
        }
    }

    async stopActivity(id: string): Promise<void> {
        try {
            this.state.isLoading = true;
            this.state.error = null;
            
            // Use activityService to stop activity
            const updatedActivity = await activityService.stopActivity(id);
            const index = this.state.activities.findIndex(a => a.id === id);
            if (index !== -1) {
                this.state.activities[index] = updatedActivity;
            }
            
        } catch (error) {
            this.state.error = error instanceof Error ? error.message : 'An error occurred';
        } finally {
            this.state.isLoading = false;
        }
    }
}

export const homeViewModel = new HomeViewModel(); 