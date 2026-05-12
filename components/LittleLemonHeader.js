import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function LittleLemonHeader({ showBack, onBackPress, showAvatar, initials, onAvatarPress }) {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton} 
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          )}
        </View>
        <Image 
          source={require('../assets/Logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <View style={styles.rightContainer}>
          {showAvatar && (
            <TouchableOpacity onPress={onAvatarPress} style={styles.headerAvatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white', 
  },
  headerContainer: {
    justifyContent: 'space-between', 
    alignItems: 'center',  
    paddingBottom: 10,
    flexDirection: 'row',
    width: '100%',
  },
  logo: { 
    height: 40,  
    width: 150,
  },
  leftContainer: {
    flex: 1, // Takes up equal space as the right side
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 1, // Takes up equal space as the left side
    alignItems: 'flex-end',
  },
  backButton: {
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensures it sits on top
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerAvatar: {
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#71CBC0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});