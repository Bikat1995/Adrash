import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import VendorHomeScreen from '../screens/vendor/VendorHomeScreen';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import api from '../services/api';

const Stack = createNativeStackNavigator();

const VendorStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="VendorHome" component={VendorHomeScreen} options={{ title: 'Adrash Vendor', headerStyle: { backgroundColor: '#E0E5EC' } }} />
  </Stack.Navigator>
);

const DriverStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DriverHome" component={DriverHomeScreen} options={{ title: 'Adrash Driver', headerStyle: { backgroundColor: '#E0E5EC' } }} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        if (token && userData) {
          // Verify token validity with backend if necessary, or just load user
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E5EC' }}>
        <ActivityIndicator size="large" color="#50C878" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen setAuth={setUser} />;
  }

  return user.role === 'vendor' ? <VendorStack /> : <DriverStack />;
}
