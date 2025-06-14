import "react-native-gesture-handler";
import React from 'react';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/presentation/theme/ThemeProvider';
import { ErrorBoundary } from './src/presentation/components/common/ErrorBoundary';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

function ThemedApp() {
  const { theme, themeName } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={themeName === 'gece' ? 'light' : 'dark' } />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}