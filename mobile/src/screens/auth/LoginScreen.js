import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import AppCard from '../../components/NeuCard';
import AppButton from '../../components/NeuButton';

export default function LoginScreen({ setAuth }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('vendor');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    if (phone.length < 9) return Alert.alert('Invalid Phone');
    setLoading(true);
    try {
      await api.post('/auth/otp/request', { phone, role });
      setStep(2);
    } catch (err) {
      Alert.alert('Error', 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 4) return Alert.alert('Invalid OTP');
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
      <Text style={styles.headerLogo}>🛵 Adrash</Text>
      <Text style={styles.subtitle}>Fast & Reliable Spare-parts Delivery</Text>
      
      <AppCard style={styles.card}>
        <Text style={styles.title}>{step === 1 ? 'Welcome Back' : 'Enter OTP'}</Text>
        
        {step === 1 ? (
          <>
            <View style={styles.roleContainer}>
              <TouchableOpacity 
                style={[styles.roleTab, role === 'vendor' && styles.roleTabActive]} 
                onPress={() => setRole('vendor')}>
                <Text style={[styles.roleText, role === 'vendor' && styles.roleTextActive]}>Vendor</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleTab, role === 'driver' && styles.roleTabActive]} 
                onPress={() => setRole('driver')}>
                <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>Driver</Text>
              </TouchableOpacity>
            </View>

            <TextInput 
              style={styles.input} 
              placeholder="Phone Number (e.g. 0911...)" 
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <AppButton title={loading ? "Sending..." : "Send OTP"} primary onPress={requestOtp} />
          </>
        ) : (
          <>
            <TextInput 
              style={styles.input} 
              placeholder="Enter 4-digit OTP" 
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
            />
            <AppButton title={loading ? "Verifying..." : "Login"} primary onPress={verifyOtp} />
            <TouchableOpacity onPress={() => setStep(1)} style={{marginTop: 15, alignItems: 'center'}}>
              <Text style={{color: '#B87333', fontWeight: 'bold'}}>Change Phone Number</Text>
            </TouchableOpacity>
          </>
        )}
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E3F20', // Deep Forest Green background for auth
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    color: '#DAA520', // Warm Gold
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#FDFBF7',
    fontSize: 16,
    marginBottom: 40,
  },
  card: {
    width: '100%',
    padding: 25,
    backgroundColor: '#FDFBF7',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3F20',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#EAE5D9',
    padding: 4,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleText: {
    color: '#666',
    fontWeight: 'bold',
  },
  roleTextActive: {
    color: '#1E3F20',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EAE5D9',
  }
});
