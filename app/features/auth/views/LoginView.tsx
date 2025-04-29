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
  TextInputProps,
  Alert
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';
import { MainStackParamList } from '../../home/types/navigation';
import { signInService } from '../services/authService';
import apiService from '../../../services/apiService';
import { authViewModel } from '../viewModels/AuthViewModel';

type LoginScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Login'>,
  StackNavigationProp<MainStackParamList>
>;

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginView: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setServerError(null);
    
    try {
      const user = await signInService(formData.email, formData.password);
      
      // Set the user in the authViewModel instead of navigating directly
      // This will trigger the AppNavigator to show the Main stack with Home screen
      authViewModel.setUser(user);
    } catch (error) {
      setServerError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const handleTestConnection = useCallback(async () => {
    setIsTestingConnection(true);
    setServerError(null);
    
    try {
      // First do a simple connection test
      const result = await apiService.testConnection();
      
      if (result.success) {
        // If basic connection works, perform the endpoint test
        const endpointResults = await apiService.testApiEndpoints();
        
        // Format the results for display
        let message = `${result.message}\n\nEndpoint Status:`;
        let allEndpointsSuccessful = true;
        
        Object.entries(endpointResults).forEach(([name, status]) => {
          message += `\n- ${name}: ${status.success ? '✅' : '❌'} ${status.message}`;
          if (!status.success) allEndpointsSuccessful = false;
        });
        
        // Show different alerts based on the test results
        if (allEndpointsSuccessful) {
          Alert.alert('Connection Test Successful', message);
        } else {
          Alert.alert('Partial Connection Issues', message);
        }
      } else {
        // Try fallback if first attempt fails
        const fallbackResult = await apiService.testConnectionFallback();
        
        if (fallbackResult.success) {
          Alert.alert('Connection Test', `Backend is reachable but has issues:\n${fallbackResult.message}\n\nTimestamp: ${fallbackResult.timestamp}`);
        } else {
          Alert.alert('Connection Failed', `Cannot connect to the backend (port 3333):\n${fallbackResult.message}\n\nMake sure the server is running and available.`);
        }
      }
    } catch (error) {
      Alert.alert('Connection Error', `There was a problem testing the connection:\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTestingConnection(false);
    }
  }, []);

  const handleChange = useCallback((name: keyof LoginFormData, value: string) => {
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

  const navigateToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    // Implement forgot password functionality
    console.log('Forgot password pressed');
  }, []);

  // Memoize input fields to prevent unnecessary re-renders
  const renderInputField = useCallback((
    name: keyof LoginFormData,
    placeholder: string,
    options?: {
      secureTextEntry?: boolean;
      keyboardType?: 'default' | 'email-address';
      autoCapitalize?: 'none' | 'sentences';
      autoCorrect?: boolean;
      toggleVisibility?: () => void;
      showPasswordIcon?: boolean;
      isPasswordVisible?: boolean;
      textContentType?: TextInputProps['textContentType'];
      autoComplete?: TextInputProps['autoComplete'];
    }
  ) => {
    const error = errors[name];
    
    return (
      <View style={styles.inputWrapper}>
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
        <Text style={styles.headerTitle}>Sign in</Text>
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
            
            <TouchableOpacity 
              style={styles.forgotPasswordButton} 
              onPress={handleForgotPassword}
              activeOpacity={0.6}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign in</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.signUpPrompt}>
              <Text style={styles.signUpPromptText}>Don't have an account?</Text>
              <TouchableOpacity onPress={navigateToSignUp} activeOpacity={0.6}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {/* Connection test button */}
            <TouchableOpacity
              style={styles.testConnectionButton}
              onPress={handleTestConnection}
              disabled={isTestingConnection}
              activeOpacity={0.8}
            >
              {isTestingConnection ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.testConnectionButtonText}>Test Backend Connection</Text>
              )}
            </TouchableOpacity>
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#16a34a',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
  },
  signUpPromptText: {
    color: '#6b7280',
    fontSize: 15,
  },
  signUpLink: {
    color: '#16a34a',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 5,
  },
  testConnectionButton: {
    backgroundColor: '#0ea5e9',
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  testConnectionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default LoginView; 