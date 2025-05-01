import React, { useState, useCallback } from 'react';
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
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { workoutService, Workout } from '../../../services/workoutService';

type AddWorkoutNavigationProp = StackNavigationProp<MainStackParamList, 'AddWorkout'>;

type WorkoutIcon = 'run' | 'bike' | 'swim' | 'yoga' | 'dumbbell' | 'hiking' | 'walk' | 'lightning-bolt' | 'run-fast';

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

// List of intensity levels
const INTENSITY_LEVELS = [
  { value: 0, label: 'Light' },
  { value: 1, label: 'Moderate' },
  { value: 2, label: 'High' },
  { value: 3, label: 'Very High' },
];

const AddWorkoutView: React.FC = () => {
  const navigation = useNavigation<AddWorkoutNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  
  // Form state
  const [workoutType, setWorkoutType] = useState(Object.keys(WORKOUT_TYPES)[0]);
  const [duration, setDuration] = useState('30');
  const [caloriesBurned, setCaloriesBurned] = useState('300');
  const [intensity, setIntensity] = useState<number>(1);
  
  // Form validation
  const [errors, setErrors] = useState({
    duration: '',
    caloriesBurned: '',
  });

  // Navigate back
  const goBack = () => navigation.goBack();

  // Get workout type info
  const getWorkoutTypeInfo = (type: string) => {
    return WORKOUT_TYPES[type];
  };

  // Validate the form
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { duration: '', caloriesBurned: '' };
    
    // Duration validation
    if (!duration.trim()) {
      newErrors.duration = 'Duration is required';
      isValid = false;
    } else if (isNaN(Number(duration)) || Number(duration) <= 0) {
      newErrors.duration = 'Duration must be a positive number';
      isValid = false;
    }
    
    // Calories validation
    if (!caloriesBurned.trim()) {
      newErrors.caloriesBurned = 'Calories burned is required';
      isValid = false;
    } else if (isNaN(Number(caloriesBurned)) || Number(caloriesBurned) <= 0) {
      newErrors.caloriesBurned = 'Calories must be a positive number';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Validate duration field on change
  const handleDurationChange = useCallback((value: string) => {
    setDuration(value);
    
    // Real-time validation
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, duration: 'Duration is required' }));
    } else if (isNaN(Number(value)) || Number(value) <= 0) {
      setErrors(prev => ({ ...prev, duration: 'Duration must be a positive number' }));
    } else {
      setErrors(prev => ({ ...prev, duration: '' }));
    }
  }, []);

  // Validate calories field on change
  const handleCaloriesChange = useCallback((value: string) => {
    setCaloriesBurned(value);
    
    // Real-time validation
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, caloriesBurned: 'Calories burned is required' }));
    } else if (isNaN(Number(value)) || Number(value) <= 0) {
      setErrors(prev => ({ ...prev, caloriesBurned: 'Calories must be a positive number' }));
    } else {
      setErrors(prev => ({ ...prev, caloriesBurned: '' }));
    }
  }, []);

  // Handle save workout
  const handleSaveWorkout = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const newWorkout: Workout = {
        workout_date: Date.now(),
        type: workoutType,
        duration: Number(duration),
        calories_burned: Number(caloriesBurned),
        intensity: intensity,
      };
      
      await workoutService.addWorkout(newWorkout);
      Alert.alert(
        'Success',
        'Workout added successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Workouts') }]
      );
    } catch (error) {
      console.error('Error adding workout:', error);
      Alert.alert('Error', 'Failed to add workout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render workout type item
  const renderWorkoutTypeItem = ({ item: [type, { icon, color }] }: { item: [string, { icon: WorkoutIcon, color: string }] }) => (
    <TouchableOpacity
      style={styles.workoutTypeItem}
      onPress={() => {
        setWorkoutType(type);
        setShowTypeSelector(false);
      }}
    >
      <View style={[styles.workoutTypeIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={24} color="#ffffff" />
      </View>
      <Text style={[
        styles.workoutTypeText,
        workoutType === type && styles.workoutTypeTextSelected
      ]}>
        {type}
      </Text>
      {workoutType === type && (
        <MaterialCommunityIcons name="check" size={24} color="#16a34a" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Workout</Text>
        <View style={{ width: 40 }} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.formContainer}>
            {/* Workout Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Workout Type</Text>
              <TouchableOpacity
                style={styles.workoutTypeSelector}
                onPress={() => setShowTypeSelector(true)}
              >
                <View style={[styles.workoutTypeIcon, { backgroundColor: getWorkoutTypeInfo(workoutType).color }]}>
                  <MaterialCommunityIcons
                    name={getWorkoutTypeInfo(workoutType).icon}
                    size={24}
                    color="#ffffff"
                  />
                </View>
                <Text style={styles.workoutTypeSelectorText}>{workoutType}</Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            {/* Duration */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                style={[styles.input, errors.duration ? styles.inputError : null]}
                value={duration}
                onChangeText={handleDurationChange}
                placeholder="Enter duration in minutes"
                keyboardType="numeric"
              />
              {errors.duration ? (
                <Text style={styles.errorText}>{errors.duration}</Text>
              ) : null}
            </View>
            
            {/* Calories Burned */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Calories Burned</Text>
              <TextInput
                style={[styles.input, errors.caloriesBurned ? styles.inputError : null]}
                value={caloriesBurned}
                onChangeText={handleCaloriesChange}
                placeholder="Enter calories burned"
                keyboardType="numeric"
              />
              {errors.caloriesBurned ? (
                <Text style={styles.errorText}>{errors.caloriesBurned}</Text>
              ) : null}
            </View>
            
            {/* Intensity */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Intensity</Text>
              <View style={styles.intensityContainer}>
                {INTENSITY_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.intensityOption,
                      intensity === level.value && styles.intensitySelected,
                    ]}
                    onPress={() => setIntensity(level.value)}
                  >
                    <Text 
                      style={[
                        styles.intensityText,
                        intensity === level.value && styles.intensityTextSelected,
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Save Button */}
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveWorkout}
            >
              <Text style={styles.saveButtonText}>Save Workout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Workout Type Selector Modal */}
      <Modal
        visible={showTypeSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTypeSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Workout Type</Text>
              <TouchableOpacity
                onPress={() => setShowTypeSelector(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={Object.entries(WORKOUT_TYPES)}
              renderItem={renderWorkoutTypeItem}
              keyExtractor={([type]) => type}
              contentContainerStyle={styles.workoutTypeList}
            />
          </View>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  workoutTypeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  workoutTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutTypeSelectorText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  workoutTypeList: {
    padding: 16,
  },
  workoutTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  workoutTypeText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
  },
  workoutTypeTextSelected: {
    fontWeight: '600',
    color: '#16a34a',
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 4,
    borderRadius: 6,
  },
  intensitySelected: {
    backgroundColor: '#16a34a',
  },
  intensityText: {
    fontSize: 14,
    color: '#64748b',
  },
  intensityTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddWorkoutView; 