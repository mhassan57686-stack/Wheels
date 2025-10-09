import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import useAuthStore from '../../store/authStore';
import { formatTimeAgo } from '../../utils/dateUtils';
import axios from 'axios';

const FavoriteScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [carData, setCarData] = useState([]);
  const navigation = useNavigation();
  const { token, isAuthenticated, favorites } = useAuthStore();

  const getBaseUrl = () => {
    if (Platform.OS === 'ios') {
      return 'http://localhost:5000'; // Replace with your machine's IP for physical iOS
    } else {
      return 'http://10.0.2.2:5000'; // Android emulator
    }
  };

  const fetchCars = async () => {
    if (!isAuthenticated || !token) {
      Alert.alert('Error', 'Please log in to view favorites');
      navigation.navigate('LoginScreen');
      return;
    }

    try {
      const response = await axios.get(`${getBaseUrl()}/api/cars/ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data.ads)) {
        setCarData(response.data.ads);
      } else {
        console.warn('Unexpected response format:', response.data);
        setCarData([]);
      }
    } catch (error) {
      console.error('Error fetching ads:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch ads');
      setCarData([]);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [token, isAuthenticated]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCars();
    }, [])
  );

  const filteredFavorites = carData
    .filter((car) => favorites.includes(car.id || car._id))
    .filter((car) => car?.model?.toLowerCase().includes(searchQuery.toLowerCase()) || '');

  const renderCarItem = ({ item }) => {
    const model = item?.model || 'Unknown Model';
    const price = item?.price || 'PKR N/A';
    const location = item?.location || 'Unknown Location';
    const timestamp = item?.timestamp || new Date().toISOString();
    const carId = item.id || item._id;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CarDetailsScreen', { car: item })}
      >
        <Image
          source={
            item?.images && item.images.length > 0
              ? { uri: `${getBaseUrl()}/${item.images[0]}` }
              : require('../../assets/images/honda.png')
          }
          style={styles.carImage}
          onError={(error) => console.log('Image load error for item:', carId, error.nativeEvent.error)}
        />
        <View style={styles.info}>
          <Text style={styles.model}>{model}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.timestamp}>{formatTimeAgo(timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
           
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
              />
              <Text style={styles.logoText}>METAWHEELS</Text>
            </View>
            
          </View>

          <View style={styles.container}>
            <View style={styles.searchContainer}>
              <Image
                source={require('../../assets/images/search.png')}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search favorites..."
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
              <Text style={styles.sectionTitle}>Favorites</Text>
            </View>

            <FlatList
              data={filteredFavorites}
              renderItem={renderCarItem}
              keyExtractor={(item) => item._id || item.id || Math.random().toString()}
              contentContainerStyle={styles.list}
              ListEmptyComponent={<Text style={styles.emptyText}>No favorites yet</Text>}
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
    justifyContent: 'center',
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

export default FavoriteScreen;