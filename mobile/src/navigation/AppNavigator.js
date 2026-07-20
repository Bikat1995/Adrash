import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import VendorHomeScreen from '../screens/vendor/VendorHomeScreen';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder for other tabs
const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFBF7' }}>
    <Text style={{ color: '#1E3F20', fontSize: 18, fontWeight: 'bold' }}>Coming Soon</Text>
  </View>
);

const VendorTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#1E3F20', // Deep Forest Green
        borderTopWidth: 0,
        height: 60,
        paddingBottom: 10,
        paddingTop: 10,
      },
      tabBarActiveTintColor: '#DAA520', // Warm Gold
      tabBarInactiveTintColor: '#FDFBF7', // Warm Off-White
    }}
  >
    <Tab.Screen name="Home" component={VendorHomeScreen} options={{ tabBarIcon: () => <Text style={{fontSize: 20}}>🏠</Text> }} />
    <Tab.Screen name="Search" component={PlaceholderScreen} options={{ tabBarIcon: () => <Text style={{fontSize: 20}}>🔍</Text> }} />
    <Tab.Screen name="Orders" component={PlaceholderScreen} options={{ tabBarIcon: () => <Text style={{fontSize: 20}}>🛍️</Text> }} />
    <Tab.Screen name="Messages" component={PlaceholderScreen} options={{ tabBarIcon: () => <Text style={{fontSize: 20}}>💬</Text> }} />
    <Tab.Screen name="Profile" component={PlaceholderScreen} options={{ tabBarIcon: () => <Text style={{fontSize: 20}}>👤</Text> }} />
  </Tab.Navigator>
);

const DriverStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DriverHome" component={DriverHomeScreen} options={{ headerShown: false }} />
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFBF7' }}>
        <ActivityIndicator size="large" color="#1E3F20" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen setAuth={setUser} />;
  }

  return user.role === 'vendor' ? <VendorTabs /> : <DriverStack />;
}
