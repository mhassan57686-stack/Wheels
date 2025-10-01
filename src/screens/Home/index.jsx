import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { formatTimeAgo } from '../../utils/dateUtils';


const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [carData, setCarData] = useState([
    {
      id: '1',
      model: 'Toyota Corolla 2021',
      price: 'PKR 67 00 000',
      location: 'Karachi',
      description: 'Well-maintained, single owner, low mileage',
      image: require('../../assets/images/honda.png'),
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      model: 'Hond City 2022',
      price: 'PKR 97 000',
      location: 'Karachi',
      description: 'Excellent condition, recently serviced',
      image: require('../../assets/images/honda.png'),
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      model: 'Kia sportage 2021',
      price: 'PKR 98.00.000',
      location: 'Karachi',
      description: 'Top model, fully loaded with features',
      image: require('../../assets/images/honda.png'),
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  const filteredCars = carData.filter((car) =>
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addNewCar = (newCar) => {
    setCarData((prev) => [...prev, newCar]);
  };

  const toggleFavorite = (carId) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
    console.log('Favorites:', favorites.includes(carId) ? 'Removed' : 'Added', carId);
  };

  const renderCarItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CarDetailsScreen', { car: item })} 
    >
      <Image source={item.image} style={styles.carImage} />
      <View style={styles.info}>
        <Text style={styles.model}>{item.model}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.timestamp}>{formatTimeAgo(item.timestamp)}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <Image
          source={require('../../assets/images/heart.png')}
          style={[
            styles.favoriteIcon,
            favorites.includes(item.id) && styles.favoriteIconActive,
          ]}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Profile')}
            >
              <Image
                source={require('../../assets/images/user.png')}
                style={styles.iconImage}
              />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
              />
              <Text style={styles.logoText}>METAWHEELS</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
              style={styles.headerIcon}
            >
              <Image
                source={require('../../assets/images/bell.png')}
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <View style={styles.searchContainer}>
              <Image
                source={require('../../assets/images/search.png')}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search cars.. models..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.filterButton}>
                <Image
                  source={require('../../assets/images/filter.png')}
                  style={styles.filterIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.sectionTitle}>Latest Ads</Text>
            </View>

            <FlatList
              data={filteredCars}
              renderItem={renderCarItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              ListEmptyComponent={<Text style={styles.emptyText}>No cars found</Text>}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A2540',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A2540',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: '#00D9FF',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#00D9FF',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    width: 22,
    height: 22,
    tintColor: '#00D9FF',
  },
  titleContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A2540',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    height: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  carImage: {
    width: 100,
    height: 90,
    resizeMode: 'contain',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  model: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0A2540',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  favoriteButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    tintColor: '#999',
    resizeMode: 'contain',
    marginBottom: 35,
  },
  favoriteIconActive: {
    tintColor: '#a77e7eff',
  },
  list: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default HomeScreen;