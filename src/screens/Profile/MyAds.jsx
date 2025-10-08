import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import useAuthStore from '../../store/authStore';
import { formatTimeAgo } from '../../utils/dateUtils';
import axios from 'axios';

const MyAds = () => {
  const [carData, setCarData] = useState([]);
  const navigation = useNavigation();
  const { token, isAuthenticated, favorites, addFavorite, removeFavorite } = useAuthStore();

  const getBaseUrl = () => {
    if (Platform.OS === 'ios') {
      return 'http://localhost:5000'; // iOS device
    } else {
      return 'http://10.0.2.2:5000'; // Android emulator
    }
  };

  const fetchMyAds = async () => {
    if (!isAuthenticated || !token) {
      Alert.alert('Error', 'Please log in to view your ads', [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
      ]);
      return;
    }

    try {
      const response = await axios.get(`${getBaseUrl()}/api/auth/my-ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data.ads)) {
        setCarData(response.data.ads);
      } else {
        console.warn('Unexpected response format:', response.data);
        setCarData([]);
      }
    } catch (error) {
      console.error('Error fetching my ads:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch your ads. Please try again.');
      setCarData([]);
    }
  };

  useEffect(() => {
    fetchMyAds();
  }, [token, isAuthenticated, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      fetchMyAds();
    }, [])
  );

  const toggleFavorite = (carId) => {
    if (!carId) return;
    if (favorites.includes(carId)) {
      removeFavorite(carId);
    } else {
      addFavorite(carId);
    }
  };

  const renderCarItem = ({ item }) => {
    const model = item?.model || 'Unknown Model';
    const price = item?.price || 'PKR N/A';
    const location = item?.location || 'Unknown Location';
    const timestamp = item?.timestamp || new Date().toISOString();
    const carId = item?._id || `fallback-${Math.random().toString()}`;

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
          onError={(error) => console.error('Image load error for item:', carId, error.nativeEvent.error)}
        />
        <View style={styles.info}>
          <Text style={styles.model}>{model}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.timestamp}>{formatTimeAgo(timestamp)}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(carId)}
        >
          <Image
            source={require('../../assets/images/heart.png')}
            style={[
              styles.favoriteIcon,
              favorites.includes(carId) && styles.favoriteIconActive,
            ]}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
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
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>My Ads</Text>
          </View>
          <FlatList
            data={carData}
            renderItem={renderCarItem}
            keyExtractor={(item) => item._id || `fallback-${Math.random().toString()}`}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>You have no ads posted</Text>}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A2540',
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

export default MyAds;