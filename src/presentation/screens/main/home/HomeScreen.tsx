import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HomeNavigator } from '../../../navigation/HomeNavigator';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 