import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, View, Text, Image, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

import LittleLemonHeader from '../components/LittleLemonHeader';
import Filters from '../components/Filters';
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories } from '../database';

const API_URL = "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const categories = ['starters', 'mains', 'desserts', 'drinks', 'specials'];

export default function HomeScreen() {
    const navigation = useNavigation();
    
    const [initials, setInitials] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [filterSelections, setFilterSelections] = useState(categories.map(() => false));
    const isMounted = useRef(false);

    useEffect(() => {
        const fetchAvatarData = async () => {
            try {
                const storedFirstName = await AsyncStorage.getItem('firstName');
                const storedLastName = await AsyncStorage.getItem('lastName');
                const firstInitial = storedFirstName ? storedFirstName.charAt(0) : '';
                const lastInitial = storedLastName ? storedLastName.charAt(0) : '';
                setInitials(`${firstInitial}${lastInitial}`);
            } catch (error) {
                console.error('Failed to load avatar data', error);
            } 
        };

        // const getMenu = async () => {
        //     try {
        //         const response = await fetch(API_URL);
        //         const json = await response.json();
        //         setData(json.menu);
        //     } catch (error) {
        //         console.error(error);
        //     } finally {
        //         setLoading(false);
        //     }
        // }

        const loadMenu = async () => {
            try {
                await createTable();

                let menuItems = await getMenuItems();

                if (menuItems.length === 0) {
                    const response = await fetch(API_URL);
                    const json = await response.json();
                    menuItems = json.menu;
                    await saveMenuItems(menuItems);
                }
                setData(menuItems);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvatarData();
        //getMenu();
        loadMenu();
    }, []);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        const updateFilters = async () => {
            // Find which categories the user highlighted
            const activeCategories = categories.filter((_, i) => {
                // If everything is false (deselected), we want to return ALL categories
                if (filterSelections.every((item) => item === false)) {
                    return true;
                }
                return filterSelections[i];
            });

            try {
                const filteredData = await filterByQueryAndCategories(searchBarText, activeCategories);
                setData(filteredData);
            } catch (error) {
                console.error('Filter Error:', error);
            }
        };

        // We use a slight delay (debounce) so it doesn't query the DB on every single keystroke of the search bar
        const delaySearch = setTimeout(updateFilters, 500);
        return () => clearTimeout(delaySearch);
        
    }, [searchBarText, filterSelections]);

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
    };
    
    const getImageUrl = (imageFileName) => `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true`;

    const Item = ({ name, price, description, image }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemName}>{name}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>{description}</Text>
                <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
            </View>
            <Image source={{ uri: getImageUrl(image) }} style={styles.itemImage}/>
        </View>
    );

    const renderItem = ({ item }) => (
        <Item name={item.name} description={item.description} price={item.price} image={item.image} />
    );


    return (
        <View style={styles.container}>
            <LittleLemonHeader 
                showBack={false} 
                showAvatar={true} 
                onAvatarPress={() => navigation.navigate('Profile')}
                initials={initials}
            />

            {/* HERO BANNER SECTION */}
            <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>Little Lemon</Text>
                <View style={styles.heroBody}>
                    <View style={styles.heroTextContainer}>
                        <Text style={styles.heroSubtitle}>Chicago</Text>
                        <Text style={styles.heroDescription}>
                            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                        </Text>
                    </View>
                    
                    {/* Note: Update the require path if your local image is saved somewhere else! */}
                    <Image 
                        //source={{uri: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/bruschetta.jpg?raw=true'}} 
                        source={require('../assets/images/Little-Lemon-Images/Hero_image.png')}
                        style={styles.heroImage} 
                        // Fallback in case the local image path is wrong
                        defaultSource={{uri: 'https://via.placeholder.com/100'}}
                    />
                </View>

                {/* SEARCH BAR */}
                <View style={styles.searchBarContainer}>
                    <Ionicons name="search" size={20} color="#495E57" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        value={searchBarText}
                        onChangeText={setSearchBarText}
                    />
                </View>
            </View>

            {/* Filter UI Component */}
            <Filters 
                sections={categories} 
                selections={filterSelections} 
                onChange={handleFiltersChange} 
            />

            {isLoading ? (
                <ActivityIndicator />
                ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => item.name}
                    renderItem={renderItem}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1, // Adds the thin line between items
    borderBottomColor: '#E0E0E0', 
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1, // Forces the text container to take up all space EXCEPT the image
    paddingRight: 15, // Gives breathing room between text and image
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#495E57', // Little Lemon dark green/grey
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495E57',
  },
  itemImage: {
    width: 80,
    height: 80,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    backgroundColor: '#495E57', // Dark Green
    padding: 20,
  },
  heroTitle: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#F4CE14', // Little Lemon Yellow
    fontFamily: 'MarkaziText-Regular'
  },
  heroBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 20,
  },
  heroSubtitle: {
    fontSize: 30,
    color: '#FFFFFF',
    fontFamily: 'MarkaziText-Regular'
  },
  heroDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
    fontWeight: '500',
  },
  heroImage: {
    width: 120,
    height: 130,
    borderRadius: 15,
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDEFEE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: '#495E57',
  },
});

