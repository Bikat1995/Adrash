import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import AppCard from '../../components/NeuCard';
import AppButton from '../../components/NeuButton';

export default function VendorHomeScreen() {
  const [description, setDescription] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const categories = [
    { name: 'Engine', icon: '⚙️' },
    { name: 'Tires', icon: '🛞' },
    { name: 'Battery', icon: '🔋' },
    { name: 'Brake', icon: '🛑' },
    { name: 'Oil', icon: '🛢️' }
  ];

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerLogo}>🛵 Adrash</Text>
        </View>
        <TextInput 
          style={styles.searchBar} 
          placeholder="🔍 Search parts, vendors..." 
          placeholderTextColor="#666" 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Categories Row */}
        <View style={styles.categoriesContainer}>
          {categories.map((cat, idx) => (
            <TouchableOpacity key={idx} style={styles.categoryItem}>
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryIconText}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Vendor */}
        <Text style={styles.sectionTitle}>Featured Vendor</Text>
        <AppCard dashed style={styles.featuredCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.thumbnailPlaceholder}></View>
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.vendorName}>AutoParts Hub</Text>
              <Text style={styles.vendorMeta}>⭐ 4.8 • Addis Ababa</Text>
              <AppButton title="Order Now" style={styles.smallBtn} textStyle={styles.smallBtnText} />
            </View>
          </View>
        </AppCard>

        {/* Delivery Tracking Mock */}
        <Text style={styles.sectionTitle}>Delivery Tracking</Text>
        <AppCard style={styles.mapCard}>
          <View style={styles.mapMock}>
            <Text style={{color: '#C68A53', fontWeight: 'bold'}}>Addis Ababa</Text>
            {/* Fake route line */}
            <View style={styles.routeLine}></View>
            <Text style={{fontSize: 24, alignSelf: 'flex-end'}}>🛵</Text>
          </View>
          <View style={styles.mapDetails}>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold', color: '#1E3F20'}}>Order #1042</Text>
              <Text style={{fontSize: 12, color: '#666'}}>Status: En Route</Text>
            </View>
            <Text style={{fontWeight: 'bold', color: '#B87333'}}>Est. 10 min</Text>
          </View>
          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill}></View>
          </View>
        </AppCard>

        {/* Create Order Form */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Quick Request</Text>
        <AppCard>
          <TextInput style={styles.input} placeholder="Item Description" value={description} onChangeText={setDescription} />
          <TextInput style={styles.input} placeholder="Pickup Location" value={pickup} onChangeText={setPickup} />
          <TextInput style={styles.input} placeholder="Dropoff Location" value={dropoff} onChangeText={setDropoff} />
          <AppButton title="Find Driver" primary />
        </AppCard>

      </ScrollView>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  headerLogo: { color: '#DAA520', fontSize: 24, fontWeight: 'bold' },
  searchBar: {
    backgroundColor: '#FDFBF7',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  scrollContent: { padding: 20, paddingBottom: 100 },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  categoryItem: { alignItems: 'center' },
  categoryIconCircle: {
    width: 60, height: 60,
    borderRadius: 30,
    backgroundColor: '#EAE5D9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C68A53',
    marginBottom: 8,
  },
  categoryIconText: { fontSize: 24 },
  categoryName: { color: '#1E3F20', fontSize: 12, fontWeight: '600' },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#1E3F20', marginBottom: 10,
  },
  featuredCard: { marginBottom: 25 },
  thumbnailPlaceholder: {
    width: 80, height: 60,
    backgroundColor: '#EAE5D9',
    borderRadius: 8,
  },
  vendorName: { fontSize: 16, fontWeight: 'bold', color: '#1E3F20' },
  vendorMeta: { fontSize: 12, color: '#666', marginVertical: 4 },
  smallBtn: { paddingVertical: 6, paddingHorizontal: 12, marginVertical: 0, marginTop: 5, alignSelf: 'flex-start' },
  smallBtnText: { fontSize: 12 },
  mapCard: { marginBottom: 25, padding: 0, overflow: 'hidden' },
  mapMock: {
    height: 150,
    backgroundColor: '#F3E8D6',
    padding: 15,
    justifyContent: 'space-between',
  },
  routeLine: {
    height: 3,
    backgroundColor: '#1E3F20',
    width: '60%',
    alignSelf: 'center',
    transform: [{ rotate: '15deg' }]
  },
  mapDetails: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  progressBarBg: { height: 4, backgroundColor: '#EAE5D9', marginHorizontal: 15, marginBottom: 15, borderRadius: 2 },
  progressBarFill: { height: '100%', width: '60%', backgroundColor: '#B87333', borderRadius: 2 },
  input: {
    backgroundColor: '#FDFBF7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EAE5D9',
  }
});
