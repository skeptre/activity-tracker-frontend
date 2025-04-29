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
import AwardItem from '../components/AwardItem';
import homeStyles from '../styles/homeStyles';
import { useStepCounter } from '../../../providers/StepCounterProvider';
import { userService, User, UserRanking } from '../../../services/userService';

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
        await userService.updateSteps(todayData.steps);
        // Refresh rankings
        const rankings = await userService.getUserRankings();
        setUserRankings(rankings);
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

  const awards = [
    { id: '1', emoji: '🔥', label: 'HOT' },
    { id: '2', emoji: '🦄', label: 'OMG' },
  ];

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      {/* Header */}
      <View style={homeStyles.header}>
        <TouchableOpacity style={homeStyles.menuButton}>
          <Feather name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={homeStyles.headerTitle}>step tracker (Community)</Text>
      </View>
      
      {/* Main Content */}
      <ScrollView 
        style={homeStyles.content} 
        showsVerticalScrollIndicator={false}
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
        
        {/* Rankings and Awards */}
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
          
          <View style={homeStyles.awardsSection}>
            <Text style={homeStyles.sectionTitle}>Awards:</Text>
            <View style={homeStyles.awardsList}>
              {awards.map(award => (
                <AwardItem 
                  key={award.id}
                  emoji={award.emoji}
                  label={award.label}
                />
              ))}
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={homeStyles.inventoryPrompt}>
          <Text style={homeStyles.inventoryPromptText}>→ Go and check your inventory</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Navigation Bar */}
      <View style={homeStyles.navbar}>
        <TouchableOpacity style={homeStyles.navItem}>
          <MaterialCommunityIcons name="account-group" size={22} color="#64748b" />
          <Text style={homeStyles.navLabel}>Friends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={homeStyles.navItem}>
          <MaterialCommunityIcons name="chart-bar" size={22} color="#64748b" />
          <Text style={homeStyles.navLabel}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={homeStyles.navHomeItem}>
          <View style={homeStyles.navHomeButton}>
            <MaterialCommunityIcons name="home" size={22} color="#ffffff" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={homeStyles.navItem}>
          <MaterialCommunityIcons name="trophy" size={22} color="#64748b" />
          <Text style={homeStyles.navLabel}>Prizes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={homeStyles.navItem} onPress={navigateToSettings}>
          <MaterialCommunityIcons name="cog" size={22} color="#64748b" />
          <Text style={homeStyles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

export default HomeView; 