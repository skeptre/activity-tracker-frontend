import { makeAutoObservable } from 'mobx';
import { Activity, HomeState } from '../models/Activity';

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
            
            // TODO: Implement actual API call to fetch activities
            // const response = await activityService.getActivities(this.state.selectedDate);
            // this.state.activities = response.activities;
            
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
            
            // TODO: Implement actual API call to create activity
            // const response = await activityService.createActivity(activity);
            // this.state.activities.push(response.activity);
            
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
            
            // TODO: Implement actual API call to update activity
            // const response = await activityService.updateActivity(id, updates);
            // const index = this.state.activities.findIndex(a => a.id === id);
            // if (index !== -1) {
            //     this.state.activities[index] = response.activity;
            // }
            
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
            
            // TODO: Implement actual API call to delete activity
            // await activityService.deleteActivity(id);
            // this.state.activities = this.state.activities.filter(a => a.id !== id);
            
        } catch (error) {
            this.state.error = error instanceof Error ? error.message : 'An error occurred';
        } finally {
            this.state.isLoading = false;
        }
    }
}

export const homeViewModel = new HomeViewModel(); 