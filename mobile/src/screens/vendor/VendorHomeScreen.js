import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function VendorHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Dashboard</Text>
      <Text>Welcome to Adrash!</Text>
      <Button title="Create Delivery Request" onPress={() => {}} color="#50C878" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
  },
});
