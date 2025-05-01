import AsyncStorage from '@react-native-async-storage/async-storage';
// Comment out the import until we implement the actual API calls
// import { apiService } from './apiService';

export interface Workout {
  workout_id?: number;
  workout_date: number; // Unix timestamp
  type: string;
  duration: number; // minutes
  calories_burned: number;
  intensity: number; // 0-3
}

class WorkoutService {
  // Get all workouts
  async getWorkouts(): Promise<Workout[]> {
    try {
      // In a real app, this would use the API
      // const response = await apiService.get('/api/activity/workouts');
      // return response.data;
      
      // For now, we'll use local storage
      const workoutsJson = await AsyncStorage.getItem('workouts');
      return workoutsJson ? JSON.parse(workoutsJson) : [];
    } catch (error) {
      console.error('Error fetching workouts:', error);
      return [];
    }
  }

  // Get workout by ID
  async getWorkout(workoutId: number): Promise<Workout | null> {
    try {
      // In a real app, this would use the API
      // const response = await apiService.get(`/api/activity/workouts/${workoutId}`);
      // return response.data;
      
      // For now, we'll use local storage
      const workoutsJson = await AsyncStorage.getItem('workouts');
      const workouts: Workout[] = workoutsJson ? JSON.parse(workoutsJson) : [];
      return workouts.find(workout => workout.workout_id === workoutId) || null;
    } catch (error) {
      console.error(`Error fetching workout ${workoutId}:`, error);
      return null;
    }
  }

  // Add a new workout
  async addWorkout(workout: Workout): Promise<number> {
    try {
      // In a real app, this would use the API
      // const response = await apiService.post('/api/activity/workouts', workout);
      // return response.data.workout_id;
      
      // For now, we'll use local storage
      const workoutsJson = await AsyncStorage.getItem('workouts');
      const workouts: Workout[] = workoutsJson ? JSON.parse(workoutsJson) : [];
      
      // Generate a workout ID (mimicking a server-side DB)
      const newWorkout = {
        ...workout,
        workout_id: Date.now(), // Use timestamp as a unique ID
      };
      
      workouts.push(newWorkout);
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
      
      return newWorkout.workout_id;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  }

  // Update an existing workout
  async updateWorkout(workoutId: number, workout: Workout): Promise<boolean> {
    try {
      // In a real app, this would use the API
      // await apiService.put(`/api/activity/workouts/${workoutId}`, workout);
      
      // For now, we'll use local storage
      const workoutsJson = await AsyncStorage.getItem('workouts');
      let workouts: Workout[] = workoutsJson ? JSON.parse(workoutsJson) : [];
      
      const index = workouts.findIndex(w => w.workout_id === workoutId);
      if (index === -1) return false;
      
      workouts[index] = {
        ...workout,
        workout_id: workoutId,
      };
      
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
      return true;
    } catch (error) {
      console.error(`Error updating workout ${workoutId}:`, error);
      return false;
    }
  }

  // Delete a workout
  async deleteWorkout(workoutId: number): Promise<boolean> {
    try {
      // In a real app, this would use the API
      // await apiService.delete(`/api/activity/workouts/${workoutId}`);
      
      // For now, we'll use local storage
      const workoutsJson = await AsyncStorage.getItem('workouts');
      let workouts: Workout[] = workoutsJson ? JSON.parse(workoutsJson) : [];
      
      workouts = workouts.filter(workout => workout.workout_id !== workoutId);
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
      
      return true;
    } catch (error) {
      console.error(`Error deleting workout ${workoutId}:`, error);
      return false;
    }
  }

  // Generate sample workout data
  async generateSampleWorkouts(): Promise<void> {
    const sampleWorkouts: Workout[] = [
      {
        workout_id: 1,
        workout_date: Date.now() - 86400000 * 7, // 7 days ago
        type: 'Running',
        duration: 30,
        calories_burned: 300,
        intensity: 2,
      },
      {
        workout_id: 2,
        workout_date: Date.now() - 86400000 * 5, // 5 days ago
        type: 'Cycling',
        duration: 45,
        calories_burned: 400,
        intensity: 2,
      },
      {
        workout_id: 3,
        workout_date: Date.now() - 86400000 * 2, // 2 days ago
        type: 'Swimming',
        duration: 60,
        calories_burned: 500,
        intensity: 3,
      },
      {
        workout_id: 4,
        workout_date: Date.now() - 86400000, // 1 day ago
        type: 'Yoga',
        duration: 45,
        calories_burned: 150,
        intensity: 1,
      },
      {
        workout_id: 5,
        workout_date: Date.now(), // Today
        type: 'Weight Training',
        duration: 50,
        calories_burned: 350,
        intensity: 3,
      },
    ];

    await AsyncStorage.setItem('workouts', JSON.stringify(sampleWorkouts));
  }

  // Get today's workouts
  async getTodaysWorkouts(): Promise<Workout[]> {
    try {
      const workoutsJson = await AsyncStorage.getItem('workouts');
      const workouts: Workout[] = workoutsJson ? JSON.parse(workoutsJson) : [];
      
      // Get start and end of today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Filter workouts for today
      return workouts.filter(workout => {
        const workoutDate = new Date(workout.workout_date);
        return workoutDate >= today && workoutDate < tomorrow;
      });
    } catch (error) {
      console.error('Error fetching today\'s workouts:', error);
      return [];
    }
  }
}

export const workoutService = new WorkoutService(); 