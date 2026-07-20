import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import api from '../../services/api';
import AppCard from '../../components/NeuCard';
import AppButton from '../../components/NeuButton';

export default function DriverHomeScreen() {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let newSocket;
    const setupSocket = async () => {
      const token = await AsyncStorage.getItem('userToken');
      newSocket = io('http://localhost:3000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Driver connected to WebSocket');
        // Emit mock location immediately
        newSocket.emit('driver_ping', { lat: 9.02, lng: 38.74 });
      });

      newSocket.on('new_order', (order) => {
        setOrders(prev => [order, ...prev]);
      });

      setSocket(newSocket);
    };

    setupSocket();
    fetchNearbyOrders();

    const interval = setInterval(() => {
      if (newSocket && newSocket.connected) {
        newSocket.emit('driver_ping', { lat: 9.02 + (Math.random()*0.01), lng: 38.74 });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const fetchNearbyOrders = async () => {
    try {
      const res = await api.get('/orders/nearby');
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptOrder = async (id) => {
    try {
      await api.post(`/orders/${id}/accept`);
      Alert.alert('Success', 'Order accepted!');
      const order = orders.find(o => o.id === id);
      setActiveOrder({ ...order, status: 'matched' });
    } catch (err) {
      Alert.alert('Error', 'Could not accept order (maybe taken)');
    }
  };

  const updateStatus = async (status) => {
    if (!activeOrder) return;
    try {
      await api.post(`/orders/${activeOrder.id}/status`, { status });
      if (status === 'delivered') {
        Alert.alert('Success', 'Order delivered!');
        setActiveOrder(null);
        fetchNearbyOrders();
      } else {
        setActiveOrder({ ...activeOrder, status });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    Alert.alert('Logged Out', 'Please restart the app to login again.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={{color: '#FDFBF7'}}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20, flex: 1 }}>
        {activeOrder ? (
          <AppCard dashed style={styles.activeCard}>
            <Text style={styles.sectionTitle}>Current Delivery</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
              <Text style={{fontWeight: 'bold', color: '#1E3F20'}}>Order #{activeOrder.id}</Text>
              <Text style={{color: '#C68A53', fontWeight: 'bold'}}>{activeOrder.status.toUpperCase()}</Text>
            </View>
            <Text style={{marginBottom: 10}}>{activeOrder.item_description}</Text>
            
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
              {activeOrder.status === 'matched' && (
                <AppButton title="Mark Picked Up" primary onPress={() => updateStatus('picked_up')} style={{flex: 1}} />
              )}
              {activeOrder.status === 'picked_up' && (
                <AppButton title="Mark Delivered" primary onPress={() => updateStatus('delivered')} style={{flex: 1}} />
              )}
            </View>
          </AppCard>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Nearby Requests</Text>
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <AppCard style={{marginBottom: 15}}>
                  <Text style={{fontWeight: 'bold', color: '#1E3F20', fontSize: 16}}>Order #{item.id}</Text>
                  <Text style={{marginVertical: 8, color: '#666'}}>{item.item_description}</Text>
                  <AppButton title="Accept Delivery" primary onPress={() => acceptOrder(item.id)} />
                </AppCard>
              )}
              ListEmptyComponent={<Text style={{color: '#666', textAlign: 'center', marginTop: 20}}>No nearby orders.</Text>}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  header: {
    backgroundColor: '#1E3F20',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { color: '#DAA520', fontSize: 20, fontWeight: 'bold' },
  logoutBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#C68A53',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#1E3F20', marginBottom: 15,
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  }
});
