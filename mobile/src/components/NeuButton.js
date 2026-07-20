import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AppButton = ({ onPress, title, style, textStyle, primary }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        primary ? styles.primaryButton : null, 
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
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
    backgroundColor: '#EAE5D9', // Light gray/gold tint
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#1E3F20', // Deep Forest Green
  },
  text: {
    color: '#1E3F20',
    fontWeight: '600',
    fontSize: 16,
  },
  primaryText: {
    color: '#FFFFFF',
  }
});

export default AppButton;
