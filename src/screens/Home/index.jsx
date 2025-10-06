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

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [carData, setCarData] = useState([]); // Ensure empty array by default
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const { token } = useAuthStore();

  const getBaseUrl = () => {
    if (Platform.OS === 'ios') {
      return 'http://localhost:5000'; // Replace with your machine's IP for physical iOS, e.g., 'http://192.168.1.100:5000'
    } else {
      return 'http://10.0.2.2:5000'; // Android emulator
    }
  };

  const fetchCars = async () => {
    if (!token) {
      Alert.alert('Error', 'Please log in to view ads');
      navigation.navigate('LoginScreen');
      return;
    }

    try {
      const response = await axios.get(`${getBaseUrl()}/api/auth/ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched ads response:', response.data); // Debug response
      if (Array.isArray(response.data.ads)) {
        setCarData(response.data.ads);
      } else {
        console.warn('Unexpected response format:', response.data);
        setCarData([]); // Fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching ads:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch ads');
      setCarData([]); // Ensure carData is reset on error
    }
  };

  useEffect(() => {
    fetchCars();
  }, [token]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCars();
    }, [])
  );

  const filteredCars = carData.filter((car) =>
    car?.model?.toLowerCase().includes(searchQuery.toLowerCase()) || '' // Safe check
  );

  const toggleFavorite = (carId) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
    console.log('Favorites:', favorites.includes(carId) ? 'Removed' : 'Added', carId);
  };

  const renderCarItem = ({ item }) => {
    // Ensure all fields are defined, fallback to empty strings
    const model = item?.model || 'Unknown Model';
    const price = item?.price || 'PKR N/A';
    const location = item?.location || 'Unknown Location';
    const timestamp = item?.timestamp || new Date().toISOString();

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
          onError={(error) => console.log('Image load error for item:', item.id, error.nativeEvent.error)}
        />
        <View style={styles.info}>
          <Text style={styles.model}>{model}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.timestamp}>{formatTimeAgo(timestamp)}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id || item._id)} // Handle both id and _id
        >
          <Image
            source={require('../../assets/images/heart.png')}
            style={[
              styles.favoriteIcon,
              favorites.includes(item.id || item._id) && styles.favoriteIconActive,
            ]}
          />
        </TouchableOpacity>
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
              keyExtractor={(item) => item._id || item.id || Math.random().toString()} // Fallback key
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