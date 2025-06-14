import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import { DrawerNavigator } from './DrawerNavigator';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import { PostDetailsScreen } from '../screens/post/PostDetailsScreen';
import { ThemeSelectionScreen } from '../screens/settings/ThemeSelectionScreen';
import { ChangePasswordScreen } from '../screens/settings/ChangePasswordScreen';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const Stack = createNativeStackNavigator<MainStackParamList>();

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

function BackButton() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 16 }}
    >
      <Ionicons name="arrow-back" size={24} color={theme.foreground} />
    </TouchableOpacity>
  );
}

export function MainNavigator() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      id={undefined}
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
      }}
    >
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{
          headerShown: false,
          title: 'MoodLink',
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          headerShown: true,
          title: 'Profil',
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetailsScreen}
        options={{
          headerShown: true,
          title: 'Gönderi',
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="ThemeSelection"
        component={ThemeSelectionScreen}
        options={{
          headerShown: true,
          title: 'Tema Seçimi',
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: false, // ChangePasswordScreen kendi header'ını kullanıyor
        }}
      />
    </Stack.Navigator>
  );
} 