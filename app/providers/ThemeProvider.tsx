import React, { createContext, useContext, ReactNode } from 'react';
import theme, { Theme } from '../constants/theme';

// Create Theme Context
const ThemeContext = createContext<Theme>(theme);

// Hook to use theme
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider props interface
interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

/**
 * ThemeProvider component to make theme available throughout the app
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme: customTheme = theme 
}) => {
  return (
    <ThemeContext.Provider value={customTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 