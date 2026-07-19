import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import api from '../../services/api';
import NeuCard from '../../components/NeuCard';
import NeuButton from '../../components/NeuButton';

export default function DriverHomeScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to websocket
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    let interval;
    if (isOnline) {
      fetchNearbyOrders();
      // Emulate GPS pings every 5s using WebSocket
      interval = setInterval(async () => {
        const userData = await AsyncStorage.getItem('userData');
        if (userData && socket) {
          const user = JSON.parse(userData);
          socket.emit('driver_ping', { driverId: user.id, lat: 9.03, lng: 38.74 });
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isOnline, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('driver_location_update', (data) => {
        // Just acknowledging the broadcast loopback
        console.log('Location broadcast received:', data);
      });
    }
  }, [socket]);

  const fetchNearbyOrders = async () => {
    try {
      const res = await api.get('/orders/nearby');
      setOrders(res.data.orders);
    } catch (err) {
      console.log('Error fetching orders', err);
    }
  };

  const toggleOnline = async (val) => {
    try {
      const endpoint = val ? '/driver/online' : '/driver/offline';
      await api.post(endpoint);
      setIsOnline(val);
    } catch (err) {
      Alert.alert('Error', 'Could not update status');
    }
  };

  const acceptOrder = async (id) => {
    try {
      await api.post(`/orders/${id}/accept`);
      Alert.alert('Success', 'Order accepted');
      fetchNearbyOrders();
    } catch (err) {
      Alert.alert('Error', 'Failed to accept order. It might be taken.');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    Alert.alert('Logged Out', 'Please restart the app to login again.');
  };

  return (
    <View style={styles.container}>
      <NeuCard style={styles.statusCard}>
        <Text style={styles.title}>Driver Status</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.statusText}>{isOnline ? 'Online - Receiving Orders' : 'Offline'}</Text>
          <Switch value={isOnline} onValueChange={toggleOnline} trackColor={{ true: '#50C878' }} />
        </View>
      </NeuCard>

      <Text style={styles.sectionTitle}>Nearby Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NeuCard style={styles.orderCard}>
            <Text style={{ fontWeight: 'bold' }}>{item.item_description}</Text>
            <Text style={{ color: '#666', marginTop: 5 }}>Pickup: {item.pickup_lat}, {item.pickup_lng}</Text>
            <NeuButton title="Accept Order" primary style={{ marginTop: 15 }} onPress={() => acceptOrder(item.id)} />
          </NeuCard>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No active orders nearby.</Text>}
        style={{ width: '100%' }}
      />
      
      <NeuButton title="Logout" onPress={logout} style={{ marginTop: 10 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0E5EC',
    alignItems: 'center',
  },
  statusCard: {
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 10,
  },
  orderCard: {
    marginBottom: 15,
    padding: 15,
  }
});
