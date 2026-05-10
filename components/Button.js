import * as React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const Button = ({onPress, children, disabled, style, textStyle}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, style, disabled && styles.buttonDisabled]}
      disabled={disabled}
    >   
      <Text style={styles.buttonText, textStyle}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
        backgroundColor: '#CBD2D9', 
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#E0E0E0',
        opacity: 0.7,
    },
    buttonText: {
        fontSize: 18,
        color: '#495E57',
        fontWeight: 'bold',
    },
});

export default Button;