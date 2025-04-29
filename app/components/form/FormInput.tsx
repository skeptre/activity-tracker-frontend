import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Pressable,
  StyleProp,
  TextStyle
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

export interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  isPassword?: boolean;
  onChangeText: (text: string) => void;
  isHalfWidth?: boolean;
  labelStyle?: StyleProp<TextStyle>;
}

/**
 * A reusable form input component with validation and theming
 */
const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  touched,
  containerStyle,
  isPassword,
  onChangeText,
  isHalfWidth,
  labelStyle,
  ...props
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const hasError = !!error && touched;

  const inputStyles = [
    styles.input,
    {
      borderColor: hasError ? theme.colors.error : theme.colors.primaryLight,
      backgroundColor: theme.colors.backgroundLight,
      height: theme.input.height,
      borderRadius: theme.borderRadius.medium,
      paddingHorizontal: theme.spacing.medium,
      ...theme.shadow.small,
    },
    props.style,
  ];

  return (
    <View style={[
      styles.container, 
      isHalfWidth && styles.halfWidth,
      containerStyle
    ]}>
      {label && (
        <Text style={[
          styles.label,
          { 
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.tiny,
            fontSize: theme.fontSize.sm,
          },
          labelStyle
        ]}>
          {label}
        </Text>
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          style={inputStyles}
          placeholderTextColor={theme.colors.placeholder}
          secureTextEntry={isPassword && !showPassword}
          {...props}
          onChangeText={onChangeText}
        />

        {isPassword && (
          <Pressable
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          >
            <Text>{showPassword ? '🙈' : '👁️'}</Text>
          </Pressable>
        )}
      </View>

      {hasError && (
        <Text style={[
          styles.errorText,
          { 
            color: theme.colors.error,
            fontSize: theme.fontSize.xs,
            marginTop: theme.spacing.tiny,
          }
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: '#000000',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    fontWeight: '500',
  },
});

export default FormInput; 