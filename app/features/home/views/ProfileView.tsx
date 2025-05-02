import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { userService, User } from '../../../services/userService';
import { useStepCounter } from '../../../providers/StepCounterProvider';
import { useTheme } from '../../../providers/ThemeProvider';

type ProfileNavigationProp = StackNavigationProp<MainStackParamList, 'Profile'>;

const ProfileView: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { todayData } = useStepCounter();
  const { theme, isDark } = useTheme();

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data on mount and when screen comes into focus
  useEffect(() => {
    loadUserData();

    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const goBack = () => navigation.goBack();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate BMI if height and weight are available
  const calculateBMI = () => {
    if (user?.height && user?.weight) {
      const heightInMeters = user.height / 100;
      const bmi = user.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return '--';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.primary }]}>Profile</Text>
        <View style={{ width: 32 }} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView style={[styles.content, { backgroundColor: theme.background }]}>
          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
            <View style={styles.profileHeader}>
              {user?.profileImage ? (
                <Image 
                  source={{ uri: user.profileImage }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={[styles.profileImageText, { color: theme.primary }]}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]}>
                  {user?.name || 'User Name'}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.secondary }]}>
                  {user?.email || 'user@example.com'}
                </Text>
                <Text style={[styles.joinedDate, { color: theme.secondary }]}>
                  Joined {formatDate(user?.createdAt || new Date().toISOString())}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Metrics Section */}
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Body Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="calendar-account" size={24} color={theme.primary} />
                <Text style={[styles.metricValue, { color: theme.text }]}>{user?.age || '--'}</Text>
                <Text style={[styles.metricLabel, { color: theme.secondary }]}>Age</Text>
              </View>
              
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="human-male-height" size={24} color={theme.primary} />
                <Text style={[styles.metricValue, { color: theme.text }]}>{user?.height || '--'}</Text>
                <Text style={[styles.metricLabel, { color: theme.secondary }]}>Height (cm)</Text>
              </View>
              
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="weight" size={24} color={theme.primary} />
                <Text style={[styles.metricValue, { color: theme.text }]}>{user?.weight || '--'}</Text>
                <Text style={[styles.metricLabel, { color: theme.secondary }]}>Weight (kg)</Text>
              </View>
              
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="chart-bar" size={24} color={theme.primary} />
                <Text style={[styles.metricValue, { color: theme.text }]}>{calculateBMI()}</Text>
                <Text style={[styles.metricLabel, { color: theme.secondary }]}>BMI</Text>
              </View>
            </View>
          </View>
          
          {/* Activity Stats */}
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Activity Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="shoe-print" size={24} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.text }]}>{todayData.steps}</Text>
                <Text style={[styles.statLabel, { color: theme.secondary }]}>Current Steps</Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={24} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.text }]}>{todayData.calories}</Text>
                <Text style={[styles.statLabel, { color: theme.secondary }]}>Calories Today</Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="run" size={24} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.text }]}>--</Text>
                <Text style={[styles.statLabel, { color: theme.secondary }]}>Total Workouts</Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="timer" size={24} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.text }]}>--</Text>
                <Text style={[styles.statLabel, { color: theme.secondary }]}>Avg. Duration</Text>
              </View>
            </View>
          </View>
          
          {/* Goals Section */}
          <View style={[styles.section, styles.lastSection, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Goals</Text>
            <View style={styles.goalBar}>
              <View style={[styles.goalProgress, { backgroundColor: theme.border }]}>
                <View 
                  style={[
                    styles.goalProgressFill,
                    { backgroundColor: theme.primary, width: `${Math.min((todayData.steps / 10000) * 100, 100)}%` }
                  ]}
                />
              </View>
              <View style={styles.goalDetails}>
                <Text style={[styles.goalText, { color: theme.secondary }]}>
                  Step Goal: {todayData.steps} / 10,000
                </Text>
                <Text style={[styles.goalPercentage, { color: theme.primary }]}>
                  {Math.round((todayData.steps / 10000) * 100)}%
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  joinedDate: {
    fontSize: 12,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  goalBar: {
    marginTop: 8,
  },
  goalProgress: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 4,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 14,
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileView; 