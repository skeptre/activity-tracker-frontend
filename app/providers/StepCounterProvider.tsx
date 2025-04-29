import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { stepCounterService, StepData } from '../services/stepCounterService';

interface StepCounterContextType {
  todayData: StepData;
  weeklyData: StepData[];
  weeklyAverage: number;
  isLoading: boolean;
  isPedometerAvailable: boolean;
  refreshData: () => Promise<void>;
  generateMockData: () => Promise<void>;
}

const initialStepData: StepData = {
  date: new Date().toISOString().split('T')[0],
  steps: 0,
  calories: 0,
  distance: 0,
  duration: 0
};

const StepCounterContext = createContext<StepCounterContextType>({
  todayData: initialStepData,
  weeklyData: [],
  weeklyAverage: 0,
  isLoading: true,
  isPedometerAvailable: false,
  refreshData: async () => {},
  generateMockData: async () => {}
});

export const useStepCounter = () => useContext(StepCounterContext);

export const StepCounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayData, setTodayData] = useState<StepData>(initialStepData);
  const [weeklyData, setWeeklyData] = useState<StepData[]>([]);
  const [weeklyAverage, setWeeklyAverage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<any>(null);

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Check if pedometer is available
      const available = await stepCounterService.isAvailable();
      setIsPedometerAvailable(available);
      
      // Get today's data
      const today = await stepCounterService.getStepsToday();
      setTodayData(today);
      
      // Get weekly data
      const weekly = await stepCounterService.getStepHistory(7);
      setWeeklyData(weekly);
      
      // Get weekly average
      const average = await stepCounterService.getWeeklyAverage();
      setWeeklyAverage(average);
    } catch (error) {
      console.error('Error fetching step data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize step tracking
  const initializeTracking = async () => {
    try {
      if (subscription) {
        subscription.remove();
      }
      
      const newSubscription = await stepCounterService.startTracking((data) => {
        setTodayData(data);
        // Refresh weekly data when steps change
        fetchData();
      });
      
      setSubscription(newSubscription);
    } catch (error) {
      console.error('Error initializing step tracking:', error);
    }
  };

  // Handle app state changes
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      fetchData();
      initializeTracking();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    }
  };

  // Initialize on mount
  useEffect(() => {
    fetchData();
    initializeTracking();
    
    // Subscribe to app state changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      if (subscription) {
        subscription.remove();
      }
      appStateSubscription.remove();
    };
  }, []);
  
  // Generate mock data for development
  const generateMockData = async () => {
    await stepCounterService.generateMockData();
    await fetchData();
  };

  const value = {
    todayData,
    weeklyData,
    weeklyAverage,
    isLoading,
    isPedometerAvailable,
    refreshData: fetchData,
    generateMockData
  };

  return (
    <StepCounterContext.Provider value={value}>
      {children}
    </StepCounterContext.Provider>
  );
}; 