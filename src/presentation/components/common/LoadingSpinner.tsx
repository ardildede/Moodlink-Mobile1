import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color,
  style
}) => {
  const { theme } = useTheme();

  const sizeValue = size === 'small' ? 16 : size === 'large' ? 32 : 24;
  const spinnerColor = color || theme.primary;

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator 
        size={sizeValue} 
        color={spinnerColor} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 