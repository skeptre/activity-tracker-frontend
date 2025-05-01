import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import StepCircle from '../components/StepCircle';
import RankingItem from '../components/RankingItem';
import homeStyles from '../styles/homeStyles';
import { useStepCounter } from '../../../providers/StepCounterProvider';
import { userService, User, UserRanking } from '../../../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeViewNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

interface HomeViewProps {
  navigation: HomeViewNavigationProp;
}

const HomeView: React.FC<HomeViewProps> = observer(({ navigation }) => {
  const { 
    todayData, 
    isLoading: isStepsLoading, 
    refreshData, 
    generateMockData, 
    isPedometerAvailable 
  } = useStepCounter();

  // State for users and rankings
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRankings, setUserRankings] = useState<UserRanking[]>([]);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  // Initial setup - load user data, generate mock data if needed
  useEffect(() => {
    const loadUserData = async () => {
      setIsUserLoading(true);
      
      try {
        // Load current user
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
        
        // Get rankings
        const rankings = await userService.getUserRankings();
        setUserRankings(rankings);
        
        // Generate demo data if needed
        if (rankings.length === 0) {
          await userService.generateDemoData();
          const newRankings = await userService.getUserRankings();
          setUserRankings(newRankings);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsUserLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Generate mock step data on first load for demo
  useEffect(() => {
    if (!isPedometerAvailable) {
      generateMockData();
    }
  }, [isPedometerAvailable]);

  // Update user steps when step count changes
  useEffect(() => {
    const updateUserSteps = async () => {
      if (todayData.steps > 0) {
        // Update steps and get updated rankings
        await userService.updateSteps(todayData.steps);
        const rankings = await userService.getUserRankings();
        setUserRankings(rankings);
        
        // Also refresh current user data
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
      }
    };
    
    updateUserSteps();
  }, [todayData.steps]);

  // Refresh all data
  const handleRefresh = async () => {
    refreshData();
    setIsUserLoading(true);
    
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
      
      const rankings = await userService.getUserRankings();
      setUserRankings(rankings);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsUserLoading(false);
    }
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToWorkouts = () => {
    navigation.navigate('Workouts');
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      {/* Header */}
      <View style={homeStyles.header}>
        <Text style={homeStyles.headerTitle}>Activity Tracker</Text>
      </View>
      
      {/* Main Content */}
      <ScrollView 
        style={homeStyles.content} 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={isStepsLoading || isUserLoading}
            onRefresh={handleRefresh}
            colors={["#16a34a"]}
            tintColor="#16a34a"
          />
        }
      >
        {/* Profile Avatar */}
        <View style={homeStyles.profileSection}>
          {currentUser?.profileImage ? (
            <Image 
              source={{ uri: currentUser.profileImage }} 
              style={homeStyles.profileAvatar} 
            />
          ) : (
            <View style={[homeStyles.profileAvatar, homeStyles.defaultAvatar]}>
              <Text style={homeStyles.avatarText}>
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </View>
        
        {/* Step Circle Component with real data */}
        <StepCircle 
          stepData={todayData}
          isLoading={isStepsLoading}
          goal={10000}
        />

        {!isPedometerAvailable && (
          <TouchableOpacity 
            style={homeStyles.mockDataButton}
            onPress={generateMockData}
          >
            <Text style={homeStyles.mockDataText}>
              Pedometer not available. Tap to generate mock data.
            </Text>
          </TouchableOpacity>
        )}
        
        {/* Rankings Section - Removed Awards */}
        <View style={homeStyles.statsContainer}>
          <View style={homeStyles.rankingSection}>
            <Text style={homeStyles.sectionTitle}>Today's Ranking:</Text>
            
            {isUserLoading ? (
              <View style={homeStyles.loadingContainer}>
                <ActivityIndicator color="#16a34a" />
              </View>
            ) : userRankings.length > 0 ? (
              userRankings.map(user => (
                <RankingItem 
                  key={user.id}
                  name={user.name}
                  position={user.position}
                  imageUrl={user.profileImage}
                  steps={user.steps}
                />
              ))
            ) : (
              <Text style={homeStyles.emptyText}>No rankings available</Text>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Navigation Bar */}
      <View style={homeStyles.navbar}>
        <View style={{ flex: 1 }} />
        
        <View style={homeStyles.navButtonsContainer}>
          <TouchableOpacity style={homeStyles.navHomeItem}>
            <View style={homeStyles.navHomeButton}>
              <MaterialCommunityIcons name="home" size={24} color="#ffffff" />
            </View>
            <Text style={[homeStyles.navLabel, homeStyles.activeNavLabel]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={homeStyles.navWorkoutsItem} onPress={navigateToWorkouts}>
            <View style={homeStyles.navWorkoutsButton}>
              <MaterialCommunityIcons name="dumbbell" size={24} color="#64748b" />
            </View>
            <Text style={homeStyles.navLabel}>Workouts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={homeStyles.navProfileItem} onPress={navigateToProfile}>
            <View style={homeStyles.navProfileButton}>
              <MaterialCommunityIcons name="account" size={24} color="#64748b" />
            </View>
            <Text style={homeStyles.navLabel}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={homeStyles.navSettingsItem} onPress={navigateToSettings}>
            <View style={homeStyles.navSettingsButton}>
              <MaterialCommunityIcons name="cog" size={24} color="#64748b" />
            </View>
            <Text style={homeStyles.navLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
});

export default HomeView; 