import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StepCircleProps {
  steps: number;
  calories: number;
  minutes: number;
  distance: number;
}

const StepCircle: React.FC<StepCircleProps> = ({
  steps = 7568,
  calories = 526,
  minutes = 50,
  distance = 5
}) => {
  return (
    <View style={styles.stepCircleContainer}>
      <View style={styles.stepCircleOuter}>
        <View style={styles.stepCircleDashed} />
        <View style={styles.stepCircleInner}>
          <View style={styles.stepIconContainer}>
            <MaterialCommunityIcons name="shoe-print" size={24} color="#16a34a" />
          </View>
          <Text style={styles.stepCount}>{steps.toLocaleString()}</Text>
          <Text style={styles.stepLabel}>DAILY STEPS</Text>
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
  stepCircleDashed: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#16a34a',
    borderStyle: 'dashed',
  },
  stepCircleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIconContainer: {
    marginBottom: 5,
  },
  stepCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  stepLabel: {
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