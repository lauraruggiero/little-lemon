import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from './screens/Onboarding';
import ProfileScreen from './screens/Profile';
import SplashScreen from './screens/Splash';

const Stack = createNativeStackNavigator();

export default function App() {

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

  if (isLoading) {
    return <SplashScreen />;
  }
 
  return ( 
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        { isOnboardingComplete ? (
          <Stack.Screen name="Profile" component={ProfileScreen} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}