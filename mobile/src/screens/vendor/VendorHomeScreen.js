import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import NeuCard from '../../components/NeuCard';
import NeuButton from '../../components/NeuButton';

export default function VendorHomeScreen() {
  const [description, setDescription] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    if (!description || !pickup || !dropoff) return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    try {
      await api.post('/orders', {
        item_description: description,
        pickup_lat: 9.03, // Mock location for Addis Ababa
        pickup_lng: 38.74,
        dropoff_lat: 9.01,
        dropoff_lng: 38.75,
      });
      Alert.alert('Success', 'Order requested successfully');
      setDescription('');
      setPickup('');
      setDropoff('');
    } catch (err) {
      Alert.alert('Error', 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    // For simplicity in MVP, reloading or relying on state reload
    Alert.alert('Logged Out', 'Please restart the app to login again.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NeuCard style={styles.card}>
        <Text style={styles.title}>Request Delivery</Text>
        
        <TextInput style={styles.input} placeholder="Item Description (e.g. Toyota Brake Pads)" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Pickup Location (Address/Pin)" value={pickup} onChangeText={setPickup} />
        <TextInput style={styles.input} placeholder="Dropoff Location (Address/Pin)" value={dropoff} onChangeText={setDropoff} />
        
        <NeuButton title="Submit Request" primary onPress={createOrder} />
      </NeuCard>
      
      <NeuButton title="Logout" onPress={logout} style={{ marginTop: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#E0E5EC',
    alignItems: 'center',
    paddingTop: 40,
  },
  card: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#E0E5EC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffffff50',
    shadowColor: '#a3b1c6',
  }
});
