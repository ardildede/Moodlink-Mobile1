import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/types';

type SettingsScreenProps = DrawerScreenProps<DrawerParamList, 'Settings'>;

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const menuItems = [
    { title: 'Tema', screen: 'ThemeSelection' },
    { title: 'Şifre Değiştir', screen: 'ChangePassword' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem} 
            onPress={() => navigation.navigate(item.screen as any)}
          >
            <Text style={styles.menuItemText}>{item.title}</Text>
            <View style={styles.menuItemRight}>
              <Ionicons name="chevron-forward" size={20} color={theme.mutedForeground} />
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  menuContainer: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.foreground,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 16,
    color: theme.mutedForeground,
    marginRight: 8,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: theme.destructive,
    fontWeight: 'bold',
  },
}); 