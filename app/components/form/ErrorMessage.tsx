import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface ErrorMessageProps {
  message: string | null;
  style?: StyleProp<ViewStyle>;
}

/**
 * A reusable error message component for displaying validation or server errors
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, style }) => {
  const theme = useTheme();

  if (!message) return null;

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.errorLight,
          borderColor: theme.colors.errorBorder,
          borderRadius: theme.borderRadius.medium,
          padding: theme.spacing.medium,
          marginBottom: theme.spacing.large,
        },
        style
      ]}
    >
      <Text 
        style={[
          styles.text,
          { 
            color: theme.colors.error,
            fontSize: theme.fontSize.xs,
          }
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
  },
  text: {
    fontWeight: '500',
  },
});

export default ErrorMessage; 