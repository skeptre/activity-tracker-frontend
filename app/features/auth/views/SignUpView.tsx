import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signUpService } from '../services/authService';
import { SignUpFormData, AuthError } from '../types/auth';

export default function SignUpView() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    setServerError(null);
    
    try {
      // Remove confirmPassword before sending to the API
      const { confirmPassword, ...signUpData } = formData;
      const user = await signUpService(signUpData);
      console.log('Sign up successful:', user);
      // Navigate to home screen or verification page
      navigation.navigate('Home' as never);
    } catch (error) {
      const authError = error as AuthError;
      if (authError.field) {
        setErrors(prev => ({ ...prev, [authError.field]: authError.message }));
      } else {
        setServerError(authError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name: keyof SignUpFormData, value: string) => {
    setFormData((prev: SignUpFormData) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrowText}>{'←'}</Text>
      </TouchableOpacity>
      
      {/* Title */}
      <Text style={styles.title}>Sign up</Text>
      
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {serverError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          )}
          
          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              <TextInput
                style={[styles.input, errors.firstName ? styles.inputError : null]}
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                placeholder="First Name"
                placeholderTextColor="#a7f3d0"
              />
            </View>
            
            <View style={styles.nameInput}>
              <TextInput
                style={[styles.input, errors.lastName ? styles.inputError : null]}
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                placeholder="Last Name"
                placeholderTextColor="#a7f3d0"
              />
            </View>
          </View>
          
          <TextInput
            style={[styles.input, errors.username ? styles.inputError : null]}
            value={formData.username}
            onChangeText={(text) => handleChange('username', text)}
            placeholder="Username"
            placeholderTextColor="#a7f3d0"
            autoCapitalize="none"
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#a7f3d0"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              placeholder="Password"
              secureTextEntry={!showPassword}
              placeholderTextColor="#a7f3d0"
            />
            <Pressable
              style={styles.passwordVisibilityButton}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Text style={styles.visibilityIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </Pressable>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#a7f3d0"
            />
            <Pressable
              style={styles.passwordVisibilityButton}
              onPress={() => setShowConfirmPassword((v) => !v)}
            >
              <Text style={styles.visibilityIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
            </Pressable>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          
          {/* OR Separator */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>
          
          {/* Social Login Options */}
          <TouchableOpacity style={styles.socialButton}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={styles.socialIcon} />
            <Text style={styles.socialText}>Sign in with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialButton}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }} style={styles.socialIcon} />
            <Text style={styles.socialText}>Sign in with Facebook</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  innerContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backArrow: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
  },
  backArrowText: {
    fontSize: 24,
    color: '#14532d',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14532d',
    textAlign: 'center',
    marginBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nameInput: {
    width: '48%',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f0fdf4',
    color: '#14532d',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#f87171',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordVisibilityButton: {
    position: 'absolute',
    right: 16,
    top: 15,
  },
  visibilityIcon: {
    fontSize: 18,
    color: '#14532d',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ec4899',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  orText: {
    marginHorizontal: 12,
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: '100%',
    backgroundColor: '#fff',
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  socialText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
}); 