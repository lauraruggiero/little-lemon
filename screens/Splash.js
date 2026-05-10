import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen() {
    return(
        <View style={StyleSheet.spalshContainer}>
            <Text style={styles.splashText}>Little Lemon</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#F4CE14', // Little Lemon Yellow
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#495E57',
  },
});