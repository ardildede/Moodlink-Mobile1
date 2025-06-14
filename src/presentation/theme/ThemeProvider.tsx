import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, ThemeName, Theme } from './Colors';

interface ThemeProviderState {
  themeName: ThemeName;
  theme: Theme;
  setTheme: (name: ThemeName) => void;
  isLoading: boolean;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

const THEME_STORAGE_KEY = 'moodlink-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('white');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedThemeName = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
        if (storedThemeName && themes[storedThemeName]) {
          setThemeName(storedThemeName);
        }
      } catch (e) {
        console.error("Failed to load theme from storage", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const handleSetTheme = async (name: ThemeName) => {
    if (themes[name]) {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
        setThemeName(name);
      } catch (e) {
        console.error("Failed to save theme to storage", e);
      }
    }
  };

  const value = {
    themeName,
    theme: themes[themeName],
    setTheme: handleSetTheme,
    isLoading,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 