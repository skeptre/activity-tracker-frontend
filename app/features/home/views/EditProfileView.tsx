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
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { userService, User } from '../../../services/userService';

type EditProfileNavigationProp = StackNavigationProp<MainStackParamList, 'EditProfile'>;

const EditProfileView: React.FC = () => {
  const navigation = useNavigation<EditProfileNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    height: '',
    weight: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await userService.getCurrentUser();
      if (!userData) {
        Alert.alert('Error', 'Could not load user data');
        return;
      }
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        age: userData.age?.toString() || '',
        height: userData.height?.toString() || '',
        weight: userData.weight?.toString() || '',
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate form data
      if (!formData.firstName.trim()) {
        Alert.alert('Error', 'First name is required');
        return;
      }

      // Validate numeric fields
      const age = parseInt(formData.age);
      const height = parseFloat(formData.height);
      const weight = parseFloat(formData.weight);

      if (formData.age && isNaN(age)) {
        Alert.alert('Error', 'Age must be a valid number');
        return;
      }
      if (formData.height && isNaN(height)) {
        Alert.alert('Error', 'Height must be a valid number');
        return;
      }
      if (formData.weight && isNaN(weight)) {
        Alert.alert('Error', 'Weight must be a valid number');
        return;
      }

      // Update user data
      const success = await userService.updateUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: formData.age ? age : undefined,
        height: formData.height ? height : undefined,
        weight: formData.weight ? weight : undefined,
      });

      if (!success) {
        throw new Error('Failed to update profile');
      }

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const goBack = () => navigation.goBack();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#16a34a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave}
          disabled={isSaving}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
            placeholder="Enter your first name"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
            placeholder="Enter your last name"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.email}
            editable={false}
            placeholder="Email address"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
            placeholder="Enter your age"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={formData.height}
            onChangeText={(text) => setFormData(prev => ({ ...prev, height: text }))}
            placeholder="Enter your height"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={formData.weight}
            onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
            placeholder="Enter your weight"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  disabledInput: {
    backgroundColor: '#f8fafc',
  },
});

export default EditProfileView; 