import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

export default function Filters({ selections, onChange, sections }) {
    return(
        <View style={styles.filtersContainer}>
            <Text style={styles.title}>ORDER FOR DELIVERY!</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {sections.map((section, index) => (
                <TouchableOpacity 
                    key={index}
                    onPress={() => onChange(index)} 
                    style={[
                        styles.button,
                        selections[index] ? styles.buttonActive : styles.buttonInactive,
                    ]}>
                    <Text
                        style={[
                            styles.text,
                            selections[index] ? styles.textActive : styles.textInactive,
                        ]}>
                        {section}
                    </Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
        </View>
    )
};


const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 15,
  },
  buttonInactive: {
    backgroundColor: '#EDEFEE',
  },
  buttonActive: {
    backgroundColor: '#495E57', // Dark Green
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'capitalize', // Added this so 'starters' becomes 'Starters'
  },
  textInactive: {
    color: '#495E57',
  },
  textActive: {
    color: '#EDEFEE',
  },
});