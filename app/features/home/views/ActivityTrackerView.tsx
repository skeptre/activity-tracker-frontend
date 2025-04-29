import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { homeViewModel } from '../viewModels/HomeViewModel';
import { Activity } from '../models/Activity';

type ActivityTimerProps = {
  activity: Activity;
  onStop: () => void;
};

const ActivityTimer: React.FC<ActivityTimerProps> = ({ activity, onStop }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    // Calculate initial elapsed time if activity is in progress
    if (activity.status === 'in_progress' && activity.startTime) {
      const startTime = new Date(activity.startTime).getTime();
      const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(initialElapsed);
    }

    // Set up timer
    const timer = setInterval(() => {
      if (activity.status === 'in_progress') {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activity]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
      <TouchableOpacity 
        style={styles.stopButton} 
        onPress={onStop}
      >
        <Text style={styles.stopButtonText}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
};

const ActivityTrackerView = observer(() => {
  const { activities, isLoading, error } = homeViewModel;

  useEffect(() => {
    homeViewModel.fetchActivities();
  }, []);

  const handleStartActivity = async (id: string) => {
    try {
      await homeViewModel.startActivity(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to start activity');
    }
  };

  const handleStopActivity = async (id: string) => {
    try {
      await homeViewModel.stopActivity(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop activity');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Group activities by status
  const pendingActivities = activities.filter(activity => activity.status === 'pending');
  const inProgressActivities = activities.filter(activity => activity.status === 'in_progress');
  const completedActivities = activities.filter(activity => activity.status === 'completed');

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return {};
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Progress</Text>
        {inProgressActivities.length === 0 ? (
          <Text style={styles.emptyText}>No activities in progress</Text>
        ) : (
          inProgressActivities.map(activity => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={[styles.priorityBadge, getPriorityStyle(activity.priority)]}>
                  {activity.priority}
                </Text>
              </View>
              {activity.description && (
                <Text style={styles.activityDescription}>{activity.description}</Text>
              )}
              <ActivityTimer 
                activity={activity} 
                onStop={() => handleStopActivity(activity.id)} 
              />
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending</Text>
        {pendingActivities.length === 0 ? (
          <Text style={styles.emptyText}>No pending activities</Text>
        ) : (
          pendingActivities.map(activity => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={[styles.priorityBadge, getPriorityStyle(activity.priority)]}>
                  {activity.priority}
                </Text>
              </View>
              {activity.description && (
                <Text style={styles.activityDescription}>{activity.description}</Text>
              )}
              <TouchableOpacity 
                style={styles.startButton} 
                onPress={() => handleStartActivity(activity.id)}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed</Text>
        {completedActivities.length === 0 ? (
          <Text style={styles.emptyText}>No completed activities</Text>
        ) : (
          completedActivities.map(activity => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={[styles.priorityBadge, getPriorityStyle(activity.priority)]}>
                  {activity.priority}
                </Text>
              </View>
              {activity.description && (
                <Text style={styles.activityDescription}>{activity.description}</Text>
              )}
              <View style={styles.completedInfo}>
                <Text style={styles.completedText}>
                  {activity.startTime && activity.endTime ? 
                    `Duration: ${Math.floor((new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime()) / 60000)} min` : 
                    'Completed'}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginBottom: 20,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#212529',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '500',
    overflow: 'hidden',
  },
  priorityHigh: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  priorityMedium: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  priorityLow: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  startButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  stopButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  stopButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  completedInfo: {
    marginTop: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ActivityTrackerView; 