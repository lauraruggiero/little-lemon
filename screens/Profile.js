import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LittleLemonHeader from '../components/LittleLemonHeader';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';

export default function ProfileScreen () {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [preferences, setPreferences] = useState({
        orderStatuses: true,
        passwordChanges: true,
        specialOffers: true,
        newsletter: true,
    });

    const userInitials = `${firstName ? firstName.charAt(0) : ''}${lastName ? lastName.charAt(0) : ''}`;

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const keys = [
                    'firstName', 'lastName', 'email', 'phoneNumber',
                    'orderStatuses', 'passwordChanges', 'specialOffers', 'newsletter'
                ];
                const storedValues = await AsyncStorage.multiGet(keys);
                let loadedPreferences = { ...preferences };

                storedValues.forEach(([key, value]) => {
                    if (value !== null) {
                        if (key === 'firstName') setFirstName(value);
                        if (key === 'lastName') setLastName(value);
                        if (key === 'email') setEmail(value);
                        if (key === 'phoneNumber') setPhoneNumber(value);
                        
                        // If the key belongs to our preferences, convert the string "true" back to a boolean
                        if (['orderStatuses', 'passwordChanges', 'specialOffers', 'newsletter'].includes(key)) {
                            loadedPreferences[key] = value === 'true';
                        }
                    }
                });

                setPreferences(loadedPreferences);


            } catch (error) {
                console.error('Failed to load profile data', error);
            }
        };
        loadProfileData();
    }, []);

    const logOut = async () => {
        try {
        await AsyncStorage.clear();
        console.log('Logged out! Reload the app to see the Onboarding screen.');
        } catch (error) {
        console.error('Error clearing data:', error);
        }
    };

    const saveChanges = async () => {
        try {
            const preferencesKeyValues = Object.entries(preferences).map(([key, value]) => {
                return [key, String(value)];
            });
            const allKeyValues = [
                ['firstName', firstName || ''],
                ['lastName', lastName || ''],
                ['email', email || ''],
                ['phoneNumber', phoneNumber || ''],
                ...preferencesKeyValues // Spread the mapped preferences into this final array
            ];
            await AsyncStorage.multiSet(allKeyValues);
            console.log('All changes saved successfully via multiSet!');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const updateState = (key) => () => {
        setPreferences((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    return (
        <View style={styles.container}>
            <LittleLemonHeader 
                showBack={true} 
                showAvatar={true} 
                initials={userInitials}
            />
            
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Personal information</Text>
                
                <Text style={styles.label}>Avatar</Text>
                <View style={styles.avatarContainer}>
                <View style={styles.profileAvatar}>
                    <Text style={styles.avatarInitialsLarge}>{userInitials}</Text>
                </View>
                
                {/* 2. USE THE NEW MODULAR BUTTONS */}
                <Button style={styles.changeBtn} textStyle={styles.changeBtnText}>Change</Button>
                <Button style={styles.removeBtn} textStyle={styles.removeBtnText}>Remove</Button>
                </View>

                {/* INPUT FIELDS */}
                <Text style={styles.label}>First name</Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

                <Text style={styles.label}>Last name</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

                <Text style={styles.label}>Phone number</Text>
                <TextInput 
                style={styles.input} 
                value={phoneNumber} 
                onChangeText={setPhoneNumber} 
                keyboardType="phone-pad" 
                placeholder="(123) 456-7890" 
                />

                {/* CHECKBOXES */}
                <Text style={styles.title}>Email notifications</Text>

                <Checkbox label="Order statuses" value={preferences.orderStatuses} onValueChange={updateState('orderStatuses')} />
                <Checkbox label="Password changes" value={preferences.passwordChanges} onValueChange={updateState('passwordChanges')} />
                <Checkbox label="Special offers" value={preferences.specialOffers} onValueChange={updateState('specialOffers')} />
                <Checkbox label="Newsletter" value={preferences.newsletter} onValueChange={updateState('newsletter')} />

                {/* LOGOUT BUTTON */}
                <Button style={styles.logoutBtn} textStyle={styles.logoutBtnText} onPress={logOut}>Log out</Button>
                
                {/* BOTTOM ACTION BUTTONS */}
                <View style={styles.actionButtonsContainer}>
                    <Button style={styles.discardBtn} textStyle={styles.discardBtnText}>
                        Discard changes
                    </Button>
                    <Button style={styles.saveBtn} textStyle={styles.saveBtnText} onPress={saveChanges}>
                        Save changes
                    </Button>
                </View>

            </ScrollView>
    
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333333',
  },
  scrollView: {
    flex: 1, 
    width: '100%', 
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#71CBC0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarInitialsLarge: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
  },
  // Custom button styles passed into the Button component
  changeBtn: {
    backgroundColor: '#495E57',
    marginRight: 15,
    paddingHorizontal: 20,
  },
  changeBtnText: {
    color: 'white',
  },
  removeBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#495E57',
    paddingHorizontal: 20,
  },
  removeBtnText: {
    color: '#495E57',
  },
  label: {
    fontSize: 14,
    color: '#494949',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  logoutBtn: {
    backgroundColor: '#F4CE14', // Brand Yellow
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#dba400',
  },
  logoutBtnText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40, // Extra padding at the bottom of the scroll view
  },
  discardBtn: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#495E57',
    marginRight: 10,
    paddingHorizontal: 0, // Override default padding to fit side-by-side
  },
  discardBtnText: {
    color: '#495E57',
    fontSize: 16,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#495E57',
    marginLeft: 10,
    paddingHorizontal: 0,
  },
  saveBtnText: {
    color: 'white',
    fontSize: 16,
  },
});