import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * A reusable button component with different variants
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  // Get button styles based on type
  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Size variations
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        height: 40,
        paddingHorizontal: theme.spacing.medium,
      },
      medium: {
        height: 48,
        paddingHorizontal: theme.spacing.large,
      },
      large: {
        height: 56,
        paddingHorizontal: theme.spacing.xlarge,
      },
    };

    // Type variations
    const typeStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary,
        ...theme.shadow.button,
      },
      secondary: {
        backgroundColor: theme.colors.backgroundLight,
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      danger: {
        backgroundColor: theme.colors.error,
      },
    };

    // Disabled state
    const disabledStyle: ViewStyle = {
      opacity: 0.6,
    };

    // Full width
    const widthStyle: ViewStyle = fullWidth ? { width: '100%' } : {};

    return [
      baseStyle,
      sizeStyles[size],
      typeStyles[type],
      disabled && disabledStyle,
      widthStyle,
    ];
  };

  // Get text styles based on type
  const getTextStyles = () => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      fontSize: theme.fontSize.md,
    };

    // Type text variations
    const typeTextStyles: Record<string, TextStyle> = {
      primary: {
        color: '#ffffff',
      },
      secondary: {
        color: theme.colors.primary,
      },
      outline: {
        color: theme.colors.text,
      },
      danger: {
        color: '#ffffff',
      },
    };

    return [baseTextStyle, typeTextStyles[type]];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={type === 'primary' || type === 'danger' ? '#ffffff' : theme.colors.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.text, getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});

export default Button; 