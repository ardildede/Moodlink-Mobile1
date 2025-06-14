import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerParamList } from './types';
import { HomeScreen } from '../screens/main/home/HomeScreen';
import { CustomDrawerContent } from '../components/navigation/CustomDrawerContent';
import { View, Text, TouchableOpacity } from 'react-native';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ThemeSelectionScreen } from '../screens/settings/ThemeSelectionScreen';

import SearchScreen from '../screens/search/SearchScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { NotificationScreen } from '../screens/notification';
import { DirectMessagesScreen } from '../screens/DirectMessagesScreen';
import { ConversationScreen } from '../screens/ConversationScreen';
import { NewConversationScreen } from '../screens/NewConversationScreen';

import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import { MoodReportScreen } from '../screens/mood/MoodReportScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createStackNavigator();

function MenuButton() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={{ marginLeft: 16 }}
    >
      <Ionicons name="menu" size={24} color={theme.foreground} />
    </TouchableOpacity>
  );
}

const MessagesStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MessageList" component={DirectMessagesScreen} />
    <Stack.Screen name="Conversation" component={ConversationScreen} />
    <Stack.Screen name="NewConversation" component={NewConversationScreen} />
  </Stack.Navigator>
);

export function DrawerNavigator() {
  const { theme } = useTheme();
  return (
    <Drawer.Navigator
      id={undefined}
      drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.foreground,
          fontSize: 18,
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
        headerLeft: () => <MenuButton />,
        drawerStyle: {
          backgroundColor: theme.card,
          borderRadius: 0,
          width: 280,
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.mutedForeground,
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Arama',
          drawerIcon: ({ color }) => <Ionicons name="search-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          title: 'Bildirimler',
          drawerIcon: ({ color }) => <Ionicons name="notifications-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="DirectMessages"
        component={MessagesStack}
        options={{
          title: 'Direkt Mesajlar',
          drawerIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="MentalHealthReport"
        component={MoodReportScreen}
        options={{
          title: 'Ruh Hali Raporu',
          drawerIcon: ({ color }) => <Ionicons name="heart-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ayarlar',
          drawerIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />,
        }}
      />

    </Drawer.Navigator>
  );
} 