import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    // Primary colors
    primary: '#16a34a',
    primaryLight: '#4ade80',
    primaryDark: '#15803d',
    
    // Background colors
    background: '#ffffff',
    backgroundLight: '#f0fdf4',
    backgroundDark: '#f9fafb',
    
    // Text colors
    text: '#000000',
    textSecondary: '#4b5563',
    textLight: '#6b7280',
    
    // Status colors
    success: '#22c55e',
    error: '#ef4444',
    errorLight: '#fee2e2',
    errorBorder: '#fecaca',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Neutrals
    border: '#e5e7eb',
    borderDark: '#d1d5db',
    placeholder: '#6b7280',
    
    // UI elements
    card: '#ffffff',
    shadow: '#000000',
  },
  
  spacing: {
    tiny: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 48,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 22,
    xxxl: 28,
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  borderRadius: {
    small: 6,
    medium: 12,
    large: 16,
    pill: 28,
  },
  
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    button: {
      shadowColor: '#16a34a',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
  },
  
  // Screen dimensions
  screenWidth: width,
  screenHeight: height,
  
  // Input styling
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  
  // Responsive sizing
  isSmallDevice: width < 375,
};

export type Theme = typeof theme;

export default theme; 