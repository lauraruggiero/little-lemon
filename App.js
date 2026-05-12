import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from './screens/Onboarding';
import ProfileScreen from './screens/Profile';
import HomeScreen from './screens/Home';
import SplashScreen from './screens/Splash';

const Stack = createNativeStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'MarkaziText-Regular': require('./assets/fonts/MarkaziText-Regular.ttf'),
    'Karla-Regular': require('./assets/fonts/Karla-Regular.ttf'),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('onboardingCompleted');
        if (value !== null && value === 'true') {
          setIsOnboardingComplete(true);
        }
      } catch(error) {
        console.error('Error reading onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkOnboardingStatus();
  }, []);

  if (!fontsLoaded || isLoading) {
    // We wait for BOTH the fonts and your onboarding check to finish!
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#495E57" />
      </View>
    );
  }
 
  return ( 
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        { isOnboardingComplete ? (
          // Onboarding completed, user is signed in
          <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          // User is NOT signed in
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}