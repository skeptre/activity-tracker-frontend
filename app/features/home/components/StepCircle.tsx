import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { StepData } from '../../../services/stepCounterService';

interface StepCircleProps {
  stepData: StepData;
  goal?: number;
  isLoading?: boolean;
}

const StepCircle: React.FC<StepCircleProps> = ({
  stepData,
  goal = 10000,
  isLoading = false
}) => {
  // Animated values
  const animatedProgress = new Animated.Value(0);
  const strokeDashoffset = new Animated.Value(0);

  // Calculate progress
  const steps = stepData.steps;
  const calories = stepData.calories;
  const minutes = stepData.duration;
  const distance = stepData.distance;
  const progress = Math.min(steps / goal, 1);

  // Circle properties
  const size = 200;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const alpha = Math.min(progress, 1);
  const strokeDashoffsetValue = circumference * (1 - alpha);

  // Animate progress
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic)
    }).start();

    Animated.timing(strokeDashoffset, {
      toValue: strokeDashoffsetValue,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic)
    }).start();
  }, [steps, goal]);

  // Get percentage text
  const getProgressText = () => {
    return `${Math.round(progress * 100)}%`;
  };

  // Loading placeholder
  if (isLoading) {
    return (
      <View style={styles.stepCircleContainer}>
        <View style={styles.stepCircleOuter}>
          <View style={styles.loadingCircle}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <View style={[styles.metricIcon, styles.calorieIcon]}>
              <MaterialCommunityIcons name="fire" size={20} color="#ef4444" />
            </View>
            <Text style={styles.metricValue}>-- kcal</Text>
          </View>
          
          <View style={styles.metricItem}>
            <View style={[styles.metricIcon, styles.timeIcon]}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.metricValue}>-- min</Text>
          </View>
          
          <View style={styles.metricItem}>
            <View style={[styles.metricIcon, styles.distanceIcon]}>
              <MaterialCommunityIcons name="map-marker-distance" size={20} color="#16a34a" />
            </View>
            <Text style={styles.metricValue}>-- km</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.stepCircleContainer}>
      <View style={styles.stepCircleOuter}>
        {/* SVG Progress Circle */}
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#16a34a"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        
        <View style={styles.stepCircleInner}>
          <View style={styles.stepIconContainer}>
            <MaterialCommunityIcons name="shoe-print" size={24} color="#16a34a" />
          </View>
          <Text style={styles.stepCount}>{steps.toLocaleString()}</Text>
          <Text style={styles.goalText}>
            Goal: {goal.toLocaleString()} · {getProgressText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <View style={[styles.metricIcon, styles.calorieIcon]}>
            <MaterialCommunityIcons name="fire" size={20} color="#ef4444" />
          </View>
          <Text style={styles.metricValue}>{calories} kcal</Text>
        </View>
        
        <View style={styles.metricItem}>
          <View style={[styles.metricIcon, styles.timeIcon]}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.metricValue}>{minutes} min</Text>
        </View>
        
        <View style={styles.metricItem}>
          <View style={[styles.metricIcon, styles.distanceIcon]}>
            <MaterialCommunityIcons name="map-marker-distance" size={20} color="#16a34a" />
          </View>
          <Text style={styles.metricValue}>{distance} km</Text>
        </View>
      </View>
    </View>
  );
};

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  stepCircleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  stepCircleOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    transform: [{ rotateZ: '-90deg' }],
  },
  stepCircleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  stepIconContainer: {
    marginBottom: 5,
  },
  stepCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  goalText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
    marginTop: 3,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  calorieIcon: {
    backgroundColor: '#fee2e2',
  },
  timeIcon: {
    backgroundColor: '#e0f2fe',
  },
  distanceIcon: {
    backgroundColor: '#f0fdf4',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});

export default StepCircle; 