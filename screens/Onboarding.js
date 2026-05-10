import * as React from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LittleLemonHeader from '../components/LittleLemonHeader';
import Button from '../components/Button';

export default function OnboardingScreen() {
    const [firstName, setFirstName] = React.useState('');
    const [email, setEmail] = React.useState('');

    const isFirstNameValid = firstName.trim().length > 0 && /^[a-zA-Z]+$/.test(firstName);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFormValid = isFirstNameValid && isEmailValid;

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('firstName', firstName);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('onboardingCompleted', 'true');
            console.log('Onboarding saved successfully!');
        } catch(error) {
            console.error('Error saving onboarding data:', error);
        }
    }

    return (
        <View style={styles.container}>
            <LittleLemonHeader />
            <KeyboardAvoidingView
                style={styles.keyboardView} // 3. Added flex: 1 to force it to the bottom
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.body}>
                        <Text style={styles.heroText}>Let us get to know you</Text>

                        <View style={styles.inputContainer}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter your first name"
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        disabled={!isFormValid}
                        onPress={completeOnboarding}
                    >
                    Next
                    </Button>
                </View>
            </ KeyboardAvoidingView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    body: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
        backgroundColor: '#F4CE14',
    },
    heroText: {
        fontSize: 24,
        color: '#333333',
        fontWeight: '600',
        marginBottom: 60,
    },
    inputContainer: {
        width: '80%',
    },
    label: {
        fontSize: 18,
        color: '#495E57',
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 2,
        borderColor: '#495E57',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 30,
        backgroundColor: 'white',
    },
    footer: {
        backgroundColor: '#F4F4F4',
        padding: 20,
        paddingBottom: 40,
        alignItems: 'flex-end', // Aligns the button to the right
    },
    
});
