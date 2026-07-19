import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Switch } from 'react-native';

export default function DriverHomeScreen() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Dashboard</Text>
      
      <View style={styles.toggleContainer}>
        <Text>Status: {isOnline ? 'Online' : 'Offline'}</Text>
        <Switch 
          value={isOnline} 
          onValueChange={(val) => setIsOnline(val)} 
        />
      </View>

      <Text style={{ marginTop: 20 }}>Nearby Orders will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
    marginTop: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  }
});
