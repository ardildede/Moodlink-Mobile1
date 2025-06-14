import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FeedScreen } from '../screens/main/home/FeedScreen';
import { HomeTabParamList } from './types';
import { useTheme } from '../theme/ThemeProvider';

const Tab = createMaterialTopTabNavigator<HomeTabParamList>();

export function HomeNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarIndicatorStyle: {
          backgroundColor: theme.primary,
        },
        tabBarStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Tab.Screen name="ForYou" options={{ title: 'Sizin İçin' }}>
        {() => <FeedScreen type="forYou" />}
      </Tab.Screen>
      <Tab.Screen name="Following" options={{ title: 'Takip Edilenler' }}>
        {() => <FeedScreen type="following" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
} 