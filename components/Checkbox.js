import React from "react";
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Checkbox({ label, value, onValueChange}) {
    return (
        <View style={styles.checkboxContainer}>
            <Pressable 
                style={[styles.checkbox, value && styles.checkboxSelected]}
                onPress={() => onValueChange(!value)}
            >
                {value && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
            <Text style={styles.checkboxLabel}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#495E57',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxSelected:{
        backgroundColor: '#495E57',
    },
    checkmark: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333333',
    },
});