import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';

// Stub screens
import VendorHomeScreen from '../screens/vendor/VendorHomeScreen';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Temporary mock auth state
const useAuth = () => {
  const [user, setUser] = useState({ role: 'vendor' }); // Change to 'driver' to test driver flow
  const [loading, setLoading] = useState(false);
  return { user, loading };
};

const VendorStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="VendorHome" component={VendorHomeScreen} options={{ title: 'Adrash Vendor' }} />
  </Stack.Navigator>
);

const DriverStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DriverHome" component={DriverHomeScreen} options={{ title: 'Adrash Driver' }} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    // Return Auth Stack (Login/OTP screen)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Login Screen</Text>
      </View>
    );
  }

  return user.role === 'vendor' ? <VendorStack /> : <DriverStack />;
}
