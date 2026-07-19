import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import NeuCard from '../../components/NeuCard';
import NeuButton from '../../components/NeuButton';

export default function LoginScreen({ setAuth }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('vendor');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    if (!phone) return Alert.alert('Error', 'Please enter your phone number');
    setLoading(true);
    try {
      await api.post('/auth/otp/request', { phone, role });
      setStep(2);
    } catch (err) {
      Alert.alert('Error', 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return Alert.alert('Error', 'Please enter the OTP');
    setLoading(true);
    try {
      const res = await api.post('/auth/otp/verify', { phone, otp, role });
      await AsyncStorage.setItem('userToken', res.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(res.data.user));
      setAuth(res.data.user);
    } catch (err) {
      Alert.alert('Error', 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NeuCard style={styles.card}>
        <Text style={styles.title}>Welcome to Adrash</Text>
        
        {step === 1 ? (
          <>
            <View style={styles.roleContainer}>
              <NeuButton 
                title="Vendor" 
                primary={role === 'vendor'} 
                onPress={() => setRole('vendor')} 
                style={styles.roleBtn} 
              />
              <NeuButton 
                title="Driver" 
                primary={role === 'driver'} 
                onPress={() => setRole('driver')} 
                style={styles.roleBtn} 
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Phone Number (+251...)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <NeuButton title="Request OTP" primary onPress={requestOtp} />
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Enter the code sent to {phone}</Text>
            <TextInput
              style={styles.input}
              placeholder="4-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
            />
            <NeuButton title="Verify & Login" primary onPress={verifyOtp} />
            <NeuButton title="Back" onPress={() => setStep(1)} />
          </>
        )}
      </NeuCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E5EC',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleBtn: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    backgroundColor: '#E0E5EC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffffff50',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: inset=true, height: inset=true },
  }
});
