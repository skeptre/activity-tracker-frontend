import AsyncStorage from '@react-native-async-storage/async-storage';
import { authViewModel } from '../features/auth/viewModels/AuthViewModel';

const USER_STORAGE_KEY = 'USER_DATA';
const RANKING_STORAGE_KEY = 'USER_RANKINGS';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Full name (computed from firstName + lastName)
  email: string;
  profileImage?: string;
  createdAt: string;
  age?: number;
  height?: number;
  weight?: number;
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
      const [firstName, ...lastNameParts] = (authUser.name || 'User').split(' ');
      const lastName = lastNameParts.join(' ');
      
      return {
        id: authUser.id,
        firstName: firstName,
        lastName: lastName || '',
        name: authUser.name || 'User',
        email: authUser.email,
        createdAt: new Date().toISOString(),
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
      
      // If firstName or lastName is being updated, update the full name
      let updatedData = { ...userData };
      if (userData.firstName !== undefined || userData.lastName !== undefined) {
        const newFirstName = userData.firstName ?? currentUser.firstName;
        const newLastName = userData.lastName ?? currentUser.lastName;
        updatedData.name = `${newFirstName} ${newLastName}`.trim();
      }
      
      // Update current user
      allUserData[currentUser.id] = {
        ...currentUser,
        ...updatedData,
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
      // Get current user
      const currentUser = await userService.getCurrentUser();
      if (!currentUser) return [];
      
      // Try to get existing rankings
      const rankingsData = await AsyncStorage.getItem(RANKING_STORAGE_KEY);
      let rankings: UserRanking[] = [];
      
      if (rankingsData) {
        rankings = JSON.parse(rankingsData);
        
        // Check if current user exists in rankings
        const userIndex = rankings.findIndex(r => r.id === currentUser.id);
        
        if (userIndex === -1) {
          // Add current user if not found
          rankings.push({
            id: currentUser.id,
            name: currentUser.name,
            steps: currentUser.steps || Math.floor(Math.random() * 3000) + 7000,
            position: rankings.length + 1,
            profileImage: currentUser.profileImage,
          });
        } else {
          // Update current user's data
          rankings[userIndex] = {
            ...rankings[userIndex],
            name: currentUser.name,
            steps: currentUser.steps || rankings[userIndex].steps,
            profileImage: currentUser.profileImage,
          };
        }
      } else {
        // No existing rankings, create new ones with demo data
        await userService.generateDemoData();
        const newRankingsData = await AsyncStorage.getItem(RANKING_STORAGE_KEY);
        if (newRankingsData) {
          rankings = JSON.parse(newRankingsData);
        }
      }
      
      // Sort and update positions
      rankings.sort((a, b) => b.steps - a.steps);
      rankings.forEach((user, index) => {
        user.position = index + 1;
      });
      
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
  generateDemoData: async (): Promise<boolean> => {
    try {
      const currentUser = await userService.getCurrentUser();
      if (!currentUser) return false;
      
      // Generate random steps for current user if not set
      const currentUserSteps = currentUser.steps || Math.floor(Math.random() * 3000) + 7000;
      
      const demoRankings: UserRanking[] = [
        {
          id: currentUser.id,
          name: currentUser.name,
          steps: currentUserSteps,
          position: 1,
          profileImage: currentUser.profileImage,
        },
        {
          id: 'demo1',
          name: 'Sarah Johnson',
          steps: Math.floor(Math.random() * 3000) + 6000,
          position: 2,
        },
        {
          id: 'demo2',
          name: 'Mike Chen',
          steps: Math.floor(Math.random() * 3000) + 5000,
          position: 3,
        },
        {
          id: 'demo3',
          name: 'Emma Wilson',
          steps: Math.floor(Math.random() * 3000) + 4000,
          position: 4,
        }
      ];
      
      // Sort rankings by steps and update positions
      demoRankings.sort((a, b) => b.steps - a.steps);
      demoRankings.forEach((user, index) => {
        user.position = index + 1;
      });
      
      await AsyncStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(demoRankings));
      return true;
    } catch (error) {
      console.error('Error generating demo data:', error);
      return false;
    }
  },

  updateUser: async (userData: Partial<User>): Promise<boolean> => {
    return await userService.updateUserData(userData);
  }
}; 