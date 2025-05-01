import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { workoutService, Workout } from '../../../services/workoutService';

type WorkoutDetailsNavigationProp = StackNavigationProp<MainStackParamList, 'WorkoutDetails'>;
type WorkoutDetailsRouteProp = RouteProp<MainStackParamList, 'WorkoutDetails'>;

interface WorkoutDetailsProps {
  route: WorkoutDetailsRouteProp;
}

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

const WorkoutDetailsView: React.FC<WorkoutDetailsProps> = ({ route }) => {
  const navigation = useNavigation<WorkoutDetailsNavigationProp>();
  const { workoutId } = route.params;
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Editable fields
  const [editDuration, setEditDuration] = useState('');
  const [editCalories, setEditCalories] = useState('');
  
  // Load workout details
  useEffect(() => {
    loadWorkoutDetails();
  }, [workoutId]);
  
  const loadWorkoutDetails = async () => {
    setIsLoading(true);
    try {
      if (!workoutId) {
        navigation.goBack();
        return;
      }
      
      const workoutData = await workoutService.getWorkout(workoutId);
      
      if (!workoutData) {
        Alert.alert('Error', 'Workout not found', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
        return;
      }
      
      setWorkout(workoutData);
      setEditDuration(workoutData.duration.toString());
      setEditCalories(workoutData.calories_burned.toString());
    } catch (error) {
      console.error('Error loading workout details:', error);
      Alert.alert('Error', 'Failed to load workout details');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate back
  const goBack = () => navigation.goBack();
  
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time from timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get icon and color for workout type
  const getWorkoutTypeInfo = (type: string) => {
    return WORKOUT_TYPES[type] || DEFAULT_WORKOUT;
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // Save edited workout
  const saveWorkout = async () => {
    if (!workout) return;
    
    const durationNum = Number(editDuration);
    const caloriesNum = Number(editCalories);
    
    // Validate inputs
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Duration must be a positive number');
      return;
    }
    
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      Alert.alert('Error', 'Calories must be a positive number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updatedWorkout: Workout = {
        ...workout,
        duration: durationNum,
        calories_burned: caloriesNum,
      };
      
      const success = await workoutService.updateWorkout(workout.workout_id!, updatedWorkout);
      
      if (success) {
        setWorkout(updatedWorkout);
        setIsEditing(false);
        Alert.alert('Success', 'Workout updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update workout');
      }
    } catch (error) {
      console.error('Error updating workout:', error);
      Alert.alert('Error', 'Failed to update workout');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete workout
  const handleDeleteWorkout = () => {
    if (!workout) return;
    
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
            setIsDeleting(true);
            try {
              const success = await workoutService.deleteWorkout(workout.workout_id!);
              
              if (success) {
                Alert.alert('Success', 'Workout deleted successfully', [
                  { 
                    text: 'OK', 
                    onPress: () => {
                      // Fix the navigation to properly go back to the Workouts screen
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Workouts' }],
                      });
                    } 
                  }
                ]);
              } else {
                Alert.alert('Error', 'Failed to delete workout');
                setIsDeleting(false);
              }
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout');
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workout Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      </SafeAreaView>
    );
  }
  
  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workout Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Workout not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const { icon, color } = getWorkoutTypeInfo(workout.type);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Details</Text>
        <TouchableOpacity onPress={toggleEditMode} style={styles.editButton} disabled={isDeleting}>
          <Ionicons name={isEditing ? "save-outline" : "pencil"} size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Workout Type */}
        <View style={styles.workoutHeader}>
          <View style={[styles.workoutIconLarge, { backgroundColor: color }]}>
            <MaterialCommunityIcons name={icon} size={36} color="#ffffff" />
          </View>
          <View style={styles.workoutHeaderInfo}>
            <Text style={styles.workoutType}>{workout.type}</Text>
            <Text style={styles.workoutDate}>{formatDate(workout.workout_date)}</Text>
            <Text style={styles.workoutTime}>{formatTime(workout.workout_date)}</Text>
          </View>
        </View>
        
        {/* Workout Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#16a34a" />
              <Text style={styles.detailLabel}>Duration</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editDuration}
                  onChangeText={setEditDuration}
                  keyboardType="numeric"
                  placeholder="Duration (minutes)"
                />
              ) : (
                <Text style={styles.detailValue}>{workout.duration} minutes</Text>
              )}
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="fire" size={24} color="#16a34a" />
              <Text style={styles.detailLabel}>Calories Burned</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editCalories}
                  onChangeText={setEditCalories}
                  keyboardType="numeric"
                  placeholder="Calories"
                />
              ) : (
                <Text style={styles.detailValue}>{workout.calories_burned} calories</Text>
              )}
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons 
                name={
                  workout.intensity <= 1 
                    ? "signal-cellular-1" 
                    : workout.intensity === 2 
                      ? "signal-cellular-2" 
                      : "signal-cellular-3"
                } 
                size={24} 
                color="#16a34a" 
              />
              <Text style={styles.detailLabel}>Intensity</Text>
              <Text style={styles.detailValue}>
                {workout.intensity === 0 ? 'Light' : 
                 workout.intensity === 1 ? 'Moderate' : 
                 workout.intensity === 2 ? 'High' : 'Very High'}
              </Text>
            </View>
          </View>
        </View>
        
        {isEditing ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveWorkout}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={toggleEditMode}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteWorkout}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <MaterialCommunityIcons name="delete" size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Delete Workout</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
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
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  editButton: {
    padding: 4,
    width: 40,
    alignItems: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  workoutIconLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  workoutHeaderInfo: {
    flex: 1,
  },
  workoutType: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 2,
  },
  workoutTime: {
    fontSize: 14,
    color: '#94a3b8',
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailItem: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937',
    marginTop: 4,
  },
  editInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1f2937',
    marginTop: 4,
  },
  actionButtons: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 6,
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 6,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutDetailsView; 