import React, { useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';
import { MainStackParamList } from '../../home/types/navigation';
import { signInService } from '../services/authService';
import { useTheme } from '../../../providers/ThemeProvider';
import Button from '../../../components/Button';
import ControlledInput from '../../../components/form/ControlledInput';
import ErrorMessage from '../../../components/form/ErrorMessage';
import useFormWithValidation from '../../../hooks/useFormWithValidation';
import { authViewModel } from '../viewModels/AuthViewModel';

type LoginScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Login'>,
  StackNavigationProp<MainStackParamList>
>;

interface LoginFormData {
  email: string;
  password: string;
}

/**
 * LoginViewRefactored component using reusable components, theme provider, and form management
 */
const LoginViewRefactored: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [serverError, setServerError] = React.useState<string | null>(null);

  // Setup react-hook-form
  const { control, submitForm, isSubmitting, formState: { errors } } = useFormWithValidation<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    onValid: async (data) => {
      setServerError(null);
      
      try {
        // Get user profile from sign-in service
        const userProfile = await signInService(data.email, data.password);
        
        // Set the user in the authViewModel
        // This will trigger the AppNavigator to show the Main stack with Home screen
        authViewModel.setUser(userProfile);
      } catch (error) {
        setServerError('Invalid email or password. Please try again.');
      }
    }
  });

  const navigateToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    // Implement forgot password functionality
    console.log('Forgot password pressed');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: theme.colors.primary, fontSize: theme.fontSize.xxl }]}>
          Activity Tracker
        </Text>
        <Text style={[styles.headerTitle, { color: theme.colors.textSecondary, fontSize: theme.fontSize.lg }]}>
          Sign in
        </Text>
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
            <ErrorMessage message={serverError} />

            <ControlledInput<LoginFormData>
              name="email"
              control={control}
              label="Email Address"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email',
                },
              }}
            />
            
            <ControlledInput<LoginFormData>
              name="password"
              control={control}
              label="Password"
              placeholder="Enter your password"
              isPassword
              autoCapitalize="none"
              rules={{
                required: 'Password is required',
              }}
            />
            
            <Text 
              style={[
                styles.forgotPasswordText, 
                { 
                  color: theme.colors.primary,
                  fontSize: theme.fontSize.sm,
                  marginBottom: theme.spacing.large,
                }
              ]} 
              onPress={handleForgotPassword}
            >
              Forgot Password?
            </Text>
            
            <Button
              title="Sign in"
              onPress={submitForm}
              loading={isSubmitting}
              fullWidth
              size="large"
            />
            
            <View style={[styles.signUpPrompt, { marginTop: theme.spacing.large }]}>
              <Text style={{ color: theme.colors.textLight }}>
                Don't have an account?
              </Text>
              <Text 
                style={{ 
                  color: theme.colors.primary, 
                  fontWeight: '600',
                  marginLeft: theme.spacing.small,
                }} 
                onPress={navigateToSignUp}
              >
                Sign up
              </Text>
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
    fontWeight: '700',
    marginBottom: 10,
  },
  headerTitle: {
    fontWeight: '600',
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
  forgotPasswordText: {
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginViewRefactored; 