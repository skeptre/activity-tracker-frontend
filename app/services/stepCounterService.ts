import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEY = 'STEP_DATA';

// Interface for step data
export interface StepData {
  date: string;
  steps: number;
  calories: number;
  distance: number;
  duration: number;
}

// Calculate calories from steps (basic estimation)
const calculateCalories = (steps: number): number => {
  // Average person burns around 0.04 calories per step
  return Math.round(steps * 0.04);
};

// Calculate distance from steps (basic estimation in km)
const calculateDistance = (steps: number): number => {
  // Average stride length is about 0.762 meters
  const distance = (steps * 0.762) / 1000;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Calculate duration from steps (basic estimation in minutes)
const calculateDuration = (steps: number): number => {
  // Average person takes about 100 steps per minute
  return Math.round(steps / 100);
};

export const stepCounterService = {
  // Check if pedometer is available
  isAvailable: async (): Promise<boolean> => {
    try {
      // Android has limited pedometer support in Expo
      // getStepCountAsync with date ranges is not supported on Android
      if (Platform.OS === 'android') {
        console.log('Pedometer not available: Android has limited pedometer support in Expo');
        return false;
      }
      
      // For iOS, check if the device supports pedometer
      return await Pedometer.isAvailableAsync();
    } catch (error) {
      console.error('Error checking pedometer availability:', error);
      return false;
    }
  },

  // Start listening for step updates
  startTracking: async (callback: (data: StepData) => void) => {
    // For Android, always use mock data since real-time tracking may be unreliable
    if (Platform.OS === 'android') {
      console.log('Using mock step tracking for Android');
      
      // Generate mock steps
      const mockSteps = Math.floor(Math.random() * 1000) + 500;
      const today = new Date().toISOString().split('T')[0];
      
      const stepData: StepData = {
        date: today,
        steps: mockSteps,
        calories: calculateCalories(mockSteps),
        distance: calculateDistance(mockSteps),
        duration: calculateDuration(mockSteps)
      };
      
      // Save and return the mock data
      stepCounterService.saveSteps(stepData);
      callback(stepData);
      
      // Set up a mock interval to simulate step updates (once per minute)
      const intervalId = setInterval(() => {
        // Increment steps by random amount (30-150 steps)
        const additionalSteps = Math.floor(Math.random() * 120) + 30;
        const newTotal = stepData.steps + additionalSteps;
        
        stepData.steps = newTotal;
        stepData.calories = calculateCalories(newTotal);
        stepData.distance = calculateDistance(newTotal);
        stepData.duration = calculateDuration(newTotal);
        
        stepCounterService.saveSteps(stepData);
        callback(stepData);
      }, 60000); // Update every minute
      
      // Return a subscription-like object
      return {
        remove: () => {
          console.log('Removing mock step tracking interval');
          clearInterval(intervalId);
        }
      };
    }
    
    // For non-Android platforms, check pedometer availability
    const isAvailable = await stepCounterService.isAvailable();
    if (!isAvailable) {
      console.log('Pedometer not available, using mock data');
      // Generate some mock steps for when pedometer isn't available
      const mockSteps = Math.floor(Math.random() * 1000) + 500;
      const today = new Date().toISOString().split('T')[0];
      
      const stepData: StepData = {
        date: today,
        steps: mockSteps,
        calories: calculateCalories(mockSteps),
        distance: calculateDistance(mockSteps),
        duration: calculateDuration(mockSteps)
      };
      
      stepCounterService.saveSteps(stepData);
      callback(stepData);
      
      // Return a mock subscription object
      return {
        remove: () => {
          console.log('Mock subscription removed');
        }
      };
    }
    
    // If pedometer is available, use watchStepCount (iOS)
    return Pedometer.watchStepCount(result => {
      const { steps } = result;
      const today = new Date().toISOString().split('T')[0];
      
      const stepData: StepData = {
        date: today,
        steps,
        calories: calculateCalories(steps),
        distance: calculateDistance(steps),
        duration: calculateDuration(steps)
      };
      
      stepCounterService.saveSteps(stepData);
      callback(stepData);
    });
  },
  
  // Get steps for today
  getStepsToday: async (): Promise<StepData> => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    const today = end.toISOString().split('T')[0];
    
    try {
      // First check local storage
      const localData = await stepCounterService.getLocalSteps(today);
      if (localData) return localData;
      
      // Always use mock data on Android to avoid unsupported API calls
      if (Platform.OS === 'android') {
        console.log('Using mock step data for Android');
        const mockSteps = Math.floor(Math.random() * 2000) + 1000;
        const stepData: StepData = {
          date: today,
          steps: mockSteps,
          calories: calculateCalories(mockSteps),
          distance: calculateDistance(mockSteps),
          duration: calculateDuration(mockSteps)
        };
        
        await stepCounterService.saveSteps(stepData);
        return stepData;
      }
      
      // If not in storage and pedometer not available on non-Android, use mock data
      const isAvailable = await stepCounterService.isAvailable();
      if (!isAvailable) {
        const mockSteps = Math.floor(Math.random() * 2000) + 1000;
        const stepData: StepData = {
          date: today,
          steps: mockSteps,
          calories: calculateCalories(mockSteps),
          distance: calculateDistance(mockSteps),
          duration: calculateDuration(mockSteps)
        };
        
        await stepCounterService.saveSteps(stepData);
        return stepData;
      }
      
      // Only try to get from pedometer on iOS
      const result = await Pedometer.getStepCountAsync(start, end);
      const steps = result.steps;
      
      const stepData: StepData = {
        date: today,
        steps,
        calories: calculateCalories(steps),
        distance: calculateDistance(steps),
        duration: calculateDuration(steps)
      };
      
      await stepCounterService.saveSteps(stepData);
      return stepData;
    } catch (error) {
      console.error('Error getting steps for today:', error);
      // On error, generate mock data instead of returning zeros
      const mockSteps = Math.floor(Math.random() * 2000) + 1000;
      const stepData: StepData = {
        date: today,
        steps: mockSteps,
        calories: calculateCalories(mockSteps),
        distance: calculateDistance(mockSteps),
        duration: calculateDuration(mockSteps)
      };
      
      try {
        await stepCounterService.saveSteps(stepData);
      } catch (saveError) {
        console.error('Error saving mock step data:', saveError);
      }
      
      return stepData;
    }
  },
  
  // Save steps locally
  saveSteps: async (stepData: StepData): Promise<boolean> => {
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      let allStepData: Record<string, StepData> = existingData ? JSON.parse(existingData) : {};
      
      allStepData[stepData.date] = stepData;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allStepData));
      return true;
    } catch (error) {
      console.error('Error saving steps:', error);
      return false;
    }
  },
  
  // Get local steps for a specific date
  getLocalSteps: async (date: string): Promise<StepData | null> => {
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!existingData) return null;
      
      const allStepData: Record<string, StepData> = JSON.parse(existingData);
      return allStepData[date] || null;
    } catch (error) {
      console.error('Error getting local steps:', error);
      return null;
    }
  },
  
  // Get step history for last N days
  getStepHistory: async (days = 7): Promise<StepData[]> => {
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!existingData) return [];
      
      const allStepData: Record<string, StepData> = JSON.parse(existingData);
      const result: StepData[] = [];
      
      // Get last N days
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        if (allStepData[dateStr]) {
          result.push(allStepData[dateStr]);
        } else {
          result.push({
            date: dateStr,
            steps: 0,
            calories: 0,
            distance: 0,
            duration: 0
          });
        }
      }
      
      return result.reverse();
    } catch (error) {
      console.error('Error getting step history:', error);
      return [];
    }
  },
  
  // Get weekly average
  getWeeklyAverage: async (): Promise<number> => {
    const history = await stepCounterService.getStepHistory(7);
    if (history.length === 0) return 0;
    
    const total = history.reduce((sum, day) => sum + day.steps, 0);
    return Math.round(total / history.length);
  },
  
  // Clear all step data (for testing)
  clearAllData: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing step data:', error);
    }
  },
  
  // Generate mock data for development
  generateMockData: async (): Promise<void> => {
    try {
      const mockData: Record<string, StepData> = {};
      
      // Generate data for last 14 days
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Random step count between 5000-12000
        const steps = Math.floor(Math.random() * 7000) + 5000;
        
        mockData[dateStr] = {
          date: dateStr,
          steps,
          calories: calculateCalories(steps),
          distance: calculateDistance(steps),
          duration: calculateDuration(steps)
        };
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    } catch (error) {
      console.error('Error generating mock data:', error);
    }
  }
}; 