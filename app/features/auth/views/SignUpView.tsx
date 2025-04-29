import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Pressable,
  StatusBar,
  SafeAreaView,
  TextInputProps
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signUpService } from '../services/authService';
import { SignUpFormData, AuthError } from '../types/auth';
import { AuthStackParamList } from '../types/navigation';
import { MainStackParamList } from '../../home/types/navigation';
import { authViewModel } from '../viewModels/AuthViewModel';

type SignUpScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'SignUp'>,
  StackNavigationProp<MainStackParamList>
>;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUpView: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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
  }, [formData]);

  const handleSignUp = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setServerError(null);
    
    try {
      // Remove confirmPassword before sending to the API
      const { confirmPassword, ...signUpData } = formData;
      const user = await signUpService(signUpData);
      console.log('Sign up successful:', user);
      
      // Set the user in the authViewModel instead of navigating directly
      // This will trigger the AppNavigator to show the Main stack with Home screen
      authViewModel.setUser(user);
    } catch (error) {
      const authError = error as AuthError;
      if (authError.field && typeof authError.field === 'string') {
        setErrors(prev => ({ ...prev, [authError.field as string]: authError.message }));
      } else {
        setServerError(authError.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const handleChange = useCallback((name: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const navigateToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  // Memoize input fields to prevent unnecessary re-renders
  const renderInputField = useCallback((
    name: keyof SignUpFormData,
    placeholder: string,
    options?: {
      secureTextEntry?: boolean;
      keyboardType?: 'default' | 'email-address';
      autoCapitalize?: 'none' | 'sentences';
      autoCorrect?: boolean;
      toggleVisibility?: () => void;
      showPasswordIcon?: boolean;
      isPasswordVisible?: boolean;
      isHalfWidth?: boolean;
      textContentType?: TextInputProps['textContentType'];
      autoComplete?: TextInputProps['autoComplete'];
    }
  ) => {
    const error = errors[name];
    
    return (
      <View style={[styles.inputWrapper, options?.isHalfWidth && styles.halfWidthInput]}>
        <TextInput
          style={[
            styles.input, 
            error ? styles.inputError : null,
          ]}
          value={formData[name]}
          onChangeText={(text) => handleChange(name, text)}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          secureTextEntry={options?.secureTextEntry}
          keyboardType={options?.keyboardType || 'default'}
          autoCapitalize={options?.autoCapitalize || 'sentences'}
          autoCorrect={options?.autoCorrect ?? true}
          textContentType={options?.textContentType}
          autoComplete={options?.autoComplete}
        />
        {options?.showPasswordIcon && (
          <Pressable
            style={styles.passwordVisibilityButton}
            onPress={options.toggleVisibility}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          >
            <Text>{options.isPasswordVisible ? '🙈' : '👁️'}</Text>
          </Pressable>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }, [formData, errors, handleChange]);

  const errorContainer = useMemo(() => {
    if (!serverError) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{serverError}</Text>
      </View>
    );
  }, [serverError]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Activity Tracker</Text>
        <Text style={styles.headerTitle}>Sign up</Text>
      </View>
      
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {errorContainer}
            
            <View style={styles.nameRow}>
              {renderInputField(
                'firstName',
                'First Name',
                { 
                  isHalfWidth: true,
                  textContentType: 'givenName',
                  autoComplete: 'name'
                }
              )}
              
              {renderInputField(
                'lastName',
                'Last Name',
                { 
                  isHalfWidth: true,
                  textContentType: 'familyName',
                  autoComplete: 'name'
                }
              )}
            </View>
            
            {renderInputField(
              'email',
              'Email Address',
              {
                keyboardType: 'email-address',
                autoCapitalize: 'none',
                autoCorrect: false,
                textContentType: 'emailAddress',
                autoComplete: 'email'
              }
            )}
            
            {renderInputField(
              'password',
              'Password',
              {
                secureTextEntry: !showPassword,
                autoCapitalize: 'none',
                showPasswordIcon: true,
                toggleVisibility: togglePasswordVisibility,
                isPasswordVisible: showPassword,
                textContentType: 'none',
                autoComplete: 'off'
              }
            )}
            
            {renderInputField(
              'confirmPassword',
              'Confirm Password',
              {
                secureTextEntry: !showConfirmPassword,
                autoCapitalize: 'none',
                showPasswordIcon: true,
                toggleVisibility: toggleConfirmPasswordVisibility,
                isPasswordVisible: showConfirmPassword,
                textContentType: 'none',
                autoComplete: 'off'
              }
            )}
            
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.signInPrompt}>
              <Text style={styles.signInPromptText}>Already have an account?</Text>
              <TouchableOpacity onPress={navigateToLogin} activeOpacity={0.6}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
  },
  innerContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfWidthInput: {
    width: '48%',
  },
  inputWrapper: {
    marginBottom: 18,
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#4ade80',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f0fdf4',
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  passwordVisibilityButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  signUpButton: {
    backgroundColor: '#16a34a',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  signInPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
  },
  signInPromptText: {
    color: '#6b7280',
    fontSize: 15,
  },
  signInLink: {
    color: '#16a34a',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 5,
  }
});

export default SignUpView; 