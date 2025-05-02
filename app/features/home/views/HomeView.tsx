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
import { useTheme } from '../../../providers/ThemeProvider';

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

  const { theme, isDark } = useTheme();

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
    <SafeAreaView style={[homeStyles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.primary} />
      {/* Modern Header: Profile (left), Title (center), Settings (right) */}
      <View style={[homeStyles.header, { backgroundColor: theme.primary }]}> 
        {/* Profile Button */}
        <TouchableOpacity onPress={navigateToProfile} style={homeStyles.headerProfileButton}>
          {currentUser?.profileImage ? (
            <Image 
              source={{ uri: currentUser.profileImage }} 
              style={[homeStyles.headerProfileAvatar, { borderColor: theme.background }]} 
            />
          ) : (
            <View style={[homeStyles.headerProfileAvatar, homeStyles.defaultAvatar, { backgroundColor: theme.card }]}> 
              <MaterialCommunityIcons name="account" size={24} color={theme.primary} />
            </View>
          )}
        </TouchableOpacity>
        {/* Title */}
        <Text style={[homeStyles.headerTitle, { color: theme.background }]}>Activity Tracker</Text>
        {/* Settings Button */}
        <TouchableOpacity onPress={navigateToSettings} style={homeStyles.headerSettingsButton}>
          <MaterialCommunityIcons name="cog" size={28} color={theme.background} />
        </TouchableOpacity>
      </View>
      {/* Main Content */}
      <ScrollView 
        style={[homeStyles.content, { backgroundColor: theme.card }]} 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={isStepsLoading || isUserLoading}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        {/* Step Circle Component with real data, now in a card */}
        <View style={[homeStyles.stepCard, { backgroundColor: theme.background, shadowColor: theme.border }]}> 
          <StepCircle 
            stepData={todayData}
            isLoading={isStepsLoading}
            goal={10000}
          />
        </View>
        {!isPedometerAvailable && (
          <TouchableOpacity 
            style={[homeStyles.mockDataButton, { backgroundColor: theme.card, borderColor: theme.primary }]}
            onPress={generateMockData}
          >
            <Text style={[homeStyles.mockDataText, { color: theme.primary }]}> 
              Pedometer not available. Tap to generate mock data.
            </Text>
          </TouchableOpacity>
        )}
        {/* Rankings Section - Removed Awards */}
        <View style={[homeStyles.statsContainer, { backgroundColor: theme.background, shadowColor: theme.border }]}> 
          <View style={homeStyles.rankingSection}>
            <Text style={[homeStyles.sectionTitle, { color: theme.text }]}>Today's Ranking:</Text>
            {isUserLoading ? (
              <View style={homeStyles.loadingContainer}>
                <ActivityIndicator color={theme.primary} />
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
              <Text style={[homeStyles.emptyText, { color: theme.secondary }]}>No rankings available</Text>
            )}
          </View>
        </View>
      </ScrollView>
      {/* Navigation Bar */}
      <View style={[homeStyles.navbar, { backgroundColor: theme.nav, borderTopColor: theme.border }]}> 
        <View style={{ flex: 1 }} />
        <View style={[homeStyles.navButtonsContainer, { width: '60%', justifyContent: 'space-between' }]}> 
          <TouchableOpacity style={homeStyles.navHomeItem}>
            <View style={[homeStyles.navHomeButton, { backgroundColor: theme.navActive, shadowColor: theme.primary }]}> 
              <MaterialCommunityIcons name="home" size={24} color={theme.background} />
            </View>
            <Text style={[homeStyles.navLabel, homeStyles.activeNavLabel, { color: theme.navActive }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.navWorkoutsItem} onPress={navigateToWorkouts}>
            <View style={[homeStyles.navWorkoutsButton, { backgroundColor: theme.nav }]}> 
              <MaterialCommunityIcons name="dumbbell" size={24} color={theme.navInactive} />
            </View>
            <Text style={[homeStyles.navLabel, { color: theme.navInactive }]}>Workouts</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
});

export default HomeView; 