import AsyncStorage from '@react-native-async-storage/async-storage';
import { authViewModel } from '../features/auth/viewModels/AuthViewModel';

const USER_STORAGE_KEY = 'USER_DATA';
const RANKING_STORAGE_KEY = 'USER_RANKINGS';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  steps?: number;
  lastActive?: string;
}

export interface UserRanking {
  id: string;
  name: string;
  steps: number;
  position: number;
  profileImage?: string;
}

export const userService = {
  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // First check if we have a user from auth
      const authUser = authViewModel.user;
      if (!authUser) return null;
      
      // Try to get additional user data from storage
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        const parsedData = JSON.parse(userData);
        const user = parsedData[authUser.id];
        if (user) return user;
      }
      
      // Create a basic user object from auth data
      return {
        id: authUser.id,
        name: authUser.name || 'User',
        email: authUser.email,
        lastActive: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Update user data
  updateUserData: async (userData: Partial<User>): Promise<boolean> => {
    try {
      const currentUser = await userService.getCurrentUser();
      if (!currentUser) return false;
      
      // Get all user data
      const storedData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const allUserData = storedData ? JSON.parse(storedData) : {};
      
      // Update current user
      allUserData[currentUser.id] = {
        ...currentUser,
        ...userData,
        lastUpdated: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(allUserData));
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  },
  
  // Get user rankings (currently generates simulated rankings)
  getUserRankings: async (): Promise<UserRanking[]> => {
    try {
      // For now, let's generate simulated rankings with current user
      const currentUser = await userService.getCurrentUser();
      if (!currentUser) return [];
      
      // Try to get existing rankings
      const rankingsData = await AsyncStorage.getItem(RANKING_STORAGE_KEY);
      if (rankingsData) {
        return JSON.parse(rankingsData);
      }
      
      // Create demo rankings
      const currentUserSteps = currentUser.steps || Math.floor(Math.random() * 3000) + 7000;
      
      // Demo users with randomized steps based on current user
      const rankings: UserRanking[] = [
        {
          id: 'user1',
          name: 'Alex Chen',
          steps: Math.floor(Math.random() * 2000) + currentUserSteps,
          position: 1,
          profileImage: 'https://randomuser.me/api/portraits/men/33.jpg',
        },
        {
          id: currentUser.id,
          name: currentUser.name,
          steps: currentUserSteps,
          position: 2,
          profileImage: currentUser.profileImage,
        },
        {
          id: 'user3',
          name: 'Jordan Taylor',
          steps: Math.max(currentUserSteps - Math.floor(Math.random() * 1500), 3000),
          position: 3,
          profileImage: 'https://randomuser.me/api/portraits/women/54.jpg',
        }
      ];
      
      // Sort by steps and update positions
      rankings.sort((a, b) => b.steps - a.steps);
      rankings.forEach((user, index) => {
        user.position = index + 1;
      });
      
      // Store rankings
      await AsyncStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(rankings));
      
      return rankings;
    } catch (error) {
      console.error('Error getting user rankings:', error);
      return [];
    }
  },
  
  // Update steps and rankings
  updateSteps: async (steps: number): Promise<boolean> => {
    try {
      // Update current user steps
      await userService.updateUserData({ steps });
      
      // Update rankings
      const rankings = await userService.getUserRankings();
      const currentUser = await userService.getCurrentUser();
      
      if (!currentUser) return false;
      
      // Find and update current user
      const userIndex = rankings.findIndex(r => r.id === currentUser.id);
      if (userIndex >= 0) {
        rankings[userIndex].steps = steps;
      }
      
      // Sort and update positions
      rankings.sort((a, b) => b.steps - a.steps);
      rankings.forEach((user, index) => {
        user.position = index + 1;
      });
      
      // Save updated rankings
      await AsyncStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(rankings));
      
      return true;
    } catch (error) {
      console.error('Error updating steps:', error);
      return false;
    }
  },
  
  // Generate demo data for testing
  generateDemoData: async (): Promise<void> => {
    try {
      const currentUser = await userService.getCurrentUser();
      if (!currentUser) return;
      
      const demoRankings: UserRanking[] = [
        {
          id: 'user1',
          name: 'Alex Chen',
          steps: 9843,
          position: 1,
          profileImage: 'https://randomuser.me/api/portraits/men/33.jpg',
        },
        {
          id: currentUser.id,
          name: currentUser.name,
          steps: 8567,
          position: 2,
          profileImage: currentUser.profileImage,
        },
        {
          id: 'user3',
          name: 'Jordan Taylor',
          steps: 7321,
          position: 3,
          profileImage: 'https://randomuser.me/api/portraits/women/54.jpg',
        },
        {
          id: 'user4',
          name: 'Morgan Lee',
          steps: 6754,
          position: 4,
          profileImage: 'https://randomuser.me/api/portraits/women/14.jpg',
        },
        {
          id: 'user5',
          name: 'Sam Wilson',
          steps: 5932,
          position: 5,
          profileImage: 'https://randomuser.me/api/portraits/men/62.jpg',
        }
      ];
      
      await AsyncStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(demoRankings));
    } catch (error) {
      console.error('Error generating demo data:', error);
    }
  }
}; 