import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { workoutService, Workout } from '../../../services/workoutService';

type WorkoutsNavigationProp = StackNavigationProp<MainStackParamList, 'Workouts'>;

type WorkoutIcon = 'run' | 'bike' | 'swim' | 'yoga' | 'dumbbell' | 'hiking' | 'walk' | 'lightning-bolt' | 'run-fast' | 'signal-cellular-1' | 'signal-cellular-2' | 'signal-cellular-3' | 'clock-outline' | 'fire' | 'chevron-right';

// Workout types with their respective icons and colors
const WORKOUT_TYPES: Record<string, { icon: WorkoutIcon, color: string }> = {
  'Running': { icon: 'run', color: '#16a34a' },
  'Cycling': { icon: 'bike', color: '#0891b2' },
  'Swimming': { icon: 'swim', color: '#0284c7' },
  'Yoga': { icon: 'yoga', color: '#7e22ce' },
  'Weight Training': { icon: 'dumbbell', color: '#b91c1c' },
  'Hiking': { icon: 'hiking', color: '#92400e' },
  'Walking': { icon: 'walk', color: '#15803d' },
  'Sprinting': { icon: 'lightning-bolt', color: '#ea580c' },
  'Jogging': { icon: 'run-fast', color: '#10b981' },
};

// Default to a generic icon if type not found
const DEFAULT_WORKOUT = { icon: 'dumbbell' as WorkoutIcon, color: '#64748b' };

const WorkoutsView: React.FC = () => {
  const navigation = useNavigation<WorkoutsNavigationProp>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load workouts on mount or when date changes
  useEffect(() => {
    loadWorkouts();
  }, [selectedDate]);

  // Load workouts for selected date
  const loadWorkouts = async () => {
    setIsLoading(true);
    try {
      // First check if we have workouts, if not, generate sample data
      const existingWorkouts = await workoutService.getWorkouts();
      if (existingWorkouts.length === 0) {
        await workoutService.generateSampleWorkouts();
      }
      
      const allWorkouts = await workoutService.getWorkouts();
      
      // Filter workouts for selected date
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const filteredWorkouts = allWorkouts.filter(workout => {
        const workoutDate = new Date(workout.workout_date);
        return workoutDate >= startOfDay && workoutDate <= endOfDay;
      });
      
      // Sort by time (most recent first)
      setWorkouts(filteredWorkouts.sort((a, b) => b.workout_date - a.workout_date));
    } catch (error) {
      console.error('Error loading workouts:', error);
      Alert.alert('Error', 'Failed to load workouts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate back
  const goBack = () => navigation.goBack();

  // Navigate to add workout screen
  const navigateToAddWorkout = () => {
    navigation.navigate('AddWorkout');
  };

  // Navigate to workout details
  const navigateToWorkoutDetails = (workoutId: number) => {
    navigation.navigate('WorkoutDetails', { workoutId });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Navigate to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    
    // Don't allow navigation to future dates
    const today = new Date();
    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Reset hours to compare dates properly
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Get icon and color for workout type
  const getWorkoutTypeInfo = (type: string) => {
    return WORKOUT_TYPES[type] || DEFAULT_WORKOUT;
  };

  // Render workout item
  const renderWorkoutItem = ({ item }: { item: Workout }) => {
    const { icon, color } = getWorkoutTypeInfo(item.type);
    
    return (
      <TouchableOpacity
        style={styles.workoutItem}
        onPress={() => navigateToWorkoutDetails(item.workout_id!)}
      >
        <View style={[styles.workoutIcon, { backgroundColor: color }]}>
          <MaterialCommunityIcons name={icon} size={24} color="#ffffff" />
        </View>
        
        <View style={styles.workoutDetails}>
          <Text style={styles.workoutType}>{item.type}</Text>
          <Text style={styles.workoutDate}>{formatDisplayDate(new Date(item.workout_date))}</Text>
        </View>
        
        <View style={styles.workoutStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#64748b" />
            <Text style={styles.statText}>{item.duration} min</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="fire" size={16} color="#64748b" />
            <Text style={styles.statText}>{item.calories_burned} cal</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons 
              name={item.intensity <= 1 ? "signal-cellular-1" : item.intensity === 2 ? "signal-cellular-2" : "signal-cellular-3"} 
              size={16} 
              color="#64748b" 
            />
            <Text style={styles.statText}>
              {item.intensity === 0 ? 'Low' : 
               item.intensity === 1 ? 'Medium' : 
               item.intensity === 2 ? 'High' : 'Very High'}
            </Text>
          </View>
        </View>
        
        <MaterialCommunityIcons name="chevron-right" size={24} color="#94a3b8" />
      </TouchableOpacity>
    );
  };

  // Delete a workout
  const handleDeleteWorkout = async (workoutId: number) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await workoutService.deleteWorkout(workoutId);
              // Refresh the list
              const updatedWorkouts = await workoutService.getWorkouts();
              setWorkouts(updatedWorkouts.sort((a, b) => b.workout_date - a.workout_date));
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workouts</Text>
        <TouchableOpacity onPress={navigateToAddWorkout} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Date Navigation */}
      <View style={styles.dateNavigation}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton}>
          <Ionicons name="chevron-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
          <Text style={styles.fullDateText}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          {!isToday(selectedDate) && (
            <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          onPress={goToNextDay} 
          style={[
            styles.dateNavButton,
            isToday(selectedDate) && styles.dateNavButtonDisabled
          ]}
          disabled={isToday(selectedDate)}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={isToday(selectedDate) ? '#d1d5db' : '#64748b'} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="dumbbell" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>No workouts found for this day</Text>
          {isToday(selectedDate) && (
            <TouchableOpacity
              style={styles.addWorkoutButton}
              onPress={navigateToAddWorkout}
            >
              <Text style={styles.addWorkoutButtonText}>Add Workout</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={item => item.workout_id?.toString() || ''}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  addButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dateNavButton: {
    padding: 8,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  fullDateText: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 24,
  },
  addWorkoutButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  addWorkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: '#64748b',
  },
  workoutStats: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  statText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  dateNavButtonDisabled: {
    opacity: 0.5,
  },
  todayButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  todayButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default WorkoutsView; 