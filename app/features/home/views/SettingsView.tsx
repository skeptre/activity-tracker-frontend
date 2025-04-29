import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../../features/auth/services/authService';
import { authViewModel } from '../../../features/auth/viewModels/AuthViewModel';

type SettingsNavigationProp = StackNavigationProp<MainStackParamList, 'Settings'>;

const SettingsView: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await authService.logout();
              // Use authViewModel to logout which will trigger the AppNavigator
              // to show the Auth stack with the Login screen
              authViewModel.logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);
  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);

  const goBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#16a34a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="account" size={22} color="#16a34a" />
            <Text style={styles.settingText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="shield-account" size={22} color="#16a34a" />
            <Text style={styles.settingText}>Privacy</Text>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="theme-light-dark" size={22} color="#16a34a" />
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#e2e8f0", true: "#86efac" }}
              thumbColor={isDarkMode ? "#16a34a" : "#f2f2f2"}
              onValueChange={toggleDarkMode}
              value={isDarkMode}
            />
          </View>
          
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="bell" size={22} color="#16a34a" />
            <Text style={styles.settingText}>Notifications</Text>
            <Switch
              trackColor={{ false: "#e2e8f0", true: "#86efac" }}
              thumbColor={notificationsEnabled ? "#16a34a" : "#f2f2f2"}
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="earth" size={22} color="#16a34a" />
            <Text style={styles.settingText}>Language</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>English</Text>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="security" size={22} color="#16a34a" />
            <Text style={styles.settingText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="backup-restore" size={22} color="#16a34a" />
            <Text style={styles.settingText}>Backup Data</Text>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.logoutItem]} 
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#ef4444" />
            <Text style={styles.logoutText}>
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="information" size={22} color="#16a34a" />
            <Text style={styles.settingText}>About Activity Tracker</Text>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="help-circle" size={22} color="#16a34a" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
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
    color: '#0f172a',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 15,
    color: '#64748b',
    marginRight: 4,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});

export default SettingsView; 