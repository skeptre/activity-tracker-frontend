import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'APP_THEME';

const lightTheme = {
  mode: 'light',
  background: '#ffffff',
  card: '#f8fafc',
  text: '#1f2937',
  primary: '#16a34a',
  secondary: '#64748b',
  border: '#e2e8f0',
  nav: '#ffffff',
  navActive: '#16a34a',
  navInactive: '#64748b',
};

const darkTheme = {
  mode: 'dark',
  background: '#18181b',
  card: '#23232a',
  text: '#f1f5f9',
  primary: '#22d3ee',
  secondary: '#a1a1aa',
  border: '#27272a',
  nav: '#23232a',
  navActive: '#22d3ee',
  navInactive: '#a1a1aa',
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === 'dark') {
        setTheme(darkTheme);
        setIsDark(true);
      } else if (saved === 'light') {
        setTheme(lightTheme);
        setIsDark(false);
      } else {
        // Use system preference
        const colorScheme = Appearance.getColorScheme();
        if (colorScheme === 'dark') {
          setTheme(darkTheme);
          setIsDark(true);
        }
      }
    })();
  }, []);

  const toggleTheme = async () => {
    if (isDark) {
      setTheme(lightTheme);
      setIsDark(false);
      await AsyncStorage.setItem(THEME_KEY, 'light');
    } else {
      setTheme(darkTheme);
      setIsDark(true);
      await AsyncStorage.setItem(THEME_KEY, 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 