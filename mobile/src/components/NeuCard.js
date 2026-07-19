import React from 'react';
import { View, StyleSheet } from 'react-native';

const NeuCard = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E0E5EC',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffffff50',
  }
});

export default NeuCard;
