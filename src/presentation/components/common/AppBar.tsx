import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation, DrawerActions } from '@react-navigation/native';

interface AppBarProps {
  title: string;
}

export function AppBar({ title }: AppBarProps) {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color={theme.foreground} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.foreground }]}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
  },
  menuButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 36, // Same width as menuButton for centering the title
  },
}); 