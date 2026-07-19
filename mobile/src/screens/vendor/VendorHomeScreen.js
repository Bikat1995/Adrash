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
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');

  const createOrder = async () => {
    if (!description || !pickup || !dropoff) return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    try {
      const orderRes = await api.post('/orders', {
        item_description: description,
        pickup_lat: 9.03, // Mock location for Addis Ababa
        pickup_lng: 38.74,
        dropoff_lat: 9.01,
        dropoff_lng: 38.75,
      });
      
      const orderId = orderRes.data.id;
      setActiveOrderId(orderId);

      // Trigger Checkout
      const checkoutRes = await api.post('/payments/checkout', {
        order_id: orderId,
        amount: 500, // 500 ETB
      });

      Alert.alert('Checkout Initiated', `Escrow payment started via Chapa. Follow link: ${checkoutRes.data.data.checkout_url}`);
      
      setDescription('');
      setPickup('');
      setDropoff('');
    } catch (err) {
      Alert.alert('Error', 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const fileDispute = async () => {
    if (!activeOrderId || !disputeReason) return Alert.alert('Error', 'Please enter a dispute reason for the active order');
    try {
      await api.post(`/orders/${activeOrderId}/dispute`, { reason: disputeReason });
      Alert.alert('Dispute Logged', 'Our team will review the log manually.');
      setDisputeReason('');
    } catch (err) {
      Alert.alert('Error', 'Could not file dispute');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    Alert.alert('Logged Out', 'Please restart the app to login again.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NeuCard style={styles.card}>
        <Text style={styles.title}>Request Delivery</Text>
        
        <TextInput style={styles.input} placeholder="Item Description (e.g. Toyota Brake Pads)" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Pickup Location (Address/Pin)" value={pickup} onChangeText={setPickup} />
        <TextInput style={styles.input} placeholder="Dropoff Location (Address/Pin)" value={dropoff} onChangeText={setDropoff} />
        
        <NeuButton title="Submit Request & Pay" primary onPress={createOrder} />
      </NeuCard>

      {activeOrderId && (
        <NeuCard style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.title}>Active Order #{activeOrderId}</Text>
          <Text style={{marginBottom: 10}}>If you face issues with this order, you can file a dispute.</Text>
          <TextInput style={styles.input} placeholder="Dispute Reason" value={disputeReason} onChangeText={setDisputeReason} />
          <NeuButton title="File Dispute" onPress={fileDispute} style={{ backgroundColor: '#FF6B6B' }} textStyle={{ color: 'white' }} />
        </NeuCard>
      )}
      
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
