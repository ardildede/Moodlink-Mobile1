import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useAuthStore } from '@/presentation/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export function CustomDrawerContent(props: any) {
  const { user, logout } = useAuthStore();

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Guest';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.profileContainer}>
        {/* User Avatar and Name */}
        <Ionicons name="person-circle-outline" size={60} color="#333" />
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userHandle}>@{user?.userName ?? 'guest'}</Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <Ionicons name="log-out-outline" size={22} color="#333" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userHandle: {
    fontSize: 14,
    color: 'gray',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
  },
}); 