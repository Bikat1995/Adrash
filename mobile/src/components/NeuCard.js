import React from 'react';
import { View, StyleSheet } from 'react-native';

const AppCard = ({ children, style, dashed }) => {
  return (
    <View style={[styles.card, dashed && styles.dashedCard, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EAE5D9',
  },
  dashedCard: {
    borderWidth: 2,
    borderColor: '#C68A53', // Terracotta/Brown
    borderStyle: 'dashed',
    backgroundColor: '#FDFBF7', // Warm off-white
  }
});

export default AppCard;
