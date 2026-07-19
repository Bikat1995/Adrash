import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const NeuButton = ({ onPress, title, style, textStyle, primary }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        primary ? styles.primaryButton : null, 
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text, 
        primary ? styles.primaryText : null,
        textStyle
      ]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E0E5EC',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffffff50',
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#50C878', // Emerald Green from spec
    shadowColor: '#3da561',
  },
  text: {
    color: '#4B0082', // Deep Violet from spec
    fontWeight: 'bold',
    fontSize: 16,
  },
  primaryText: {
    color: '#FFFFFF',
  }
});

export default NeuButton;
