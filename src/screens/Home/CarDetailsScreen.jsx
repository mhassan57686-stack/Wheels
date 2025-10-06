import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatTimeAgo } from '../../utils/dateUtils';

const CarDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params;
  const windowWidth = Dimensions.get('window').width; // Get screen width dynamically

  const getBaseUrl = () => {
    if (Platform.OS === 'ios') {
      return 'http://localhost:5000'; // Replace with your machine's IP for physical iOS, e.g., 'http://192.168.1.100:5000'
    } else {
      return 'http://10.0.2.2:5000'; // Android emulator
    }
  };

  // Debug function to get image URL
  const getImageUrl = (imagePath) => {
    console.log('Image path from backend:', imagePath);
    const fullUrl = `${getBaseUrl()}/${imagePath.replace(/^uploads\/cars\//, 'uploads/cars/')}`;
    console.log('Generated image URL:', fullUrl);
    return { uri: fullUrl };
  };

  // Check if image loads, log errors
  const handleImageError = (error) => {
    console.log('Image load error:', error.nativeEvent.error);
    Alert.alert('Error', 'Failed to load image. Check console logs.');
  };

  // Render each image in the carousel
  const renderImageItem = ({ item }) => (
    <Image
      source={getImageUrl(item)}
      style={[styles.carouselImage, { width: windowWidth - 40 }]} // Full width minus padding
      onError={handleImageError}
    />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIcon}
          >
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{car.model}</Text>
          <View style={styles.headerIcon} />
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.imageSection}>
            {car.images && car.images.length > 0 ? (
              <FlatList
                data={car.images}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()} // Use index as key
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled // Snap to full image width
                style={styles.carousel}
                getItemLayout={(data, index) => ({
                  length: windowWidth - 40, // Width of each item
                  offset: (windowWidth - 40) * index,
                  index,
                })}
              />
            ) : (
              <Image
                source={require('../../assets/images/honda.png')}
                style={[styles.carImage, { width: windowWidth - 40 }]} // Full width minus padding
                onError={handleImageError}
              />
            )}
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.model}>{car.model}</Text>
            <Text style={styles.price}>{car.price}</Text>
            <Text style={styles.location}>{car.location}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(car.timestamp)}</Text>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>
              {car.description || 'No description provided'}
            </Text>
          </View>
        </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  carousel: {
    flexGrow: 0,
  },
  carouselImage: {
    height: 300, // Increased height for full-size feel
    resizeMode: 'contain',
    borderRadius: 8,
  },
  carImage: {
    height: 300, // Increased height for full-size feel
    resizeMode: 'contain',
    borderRadius: 8,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  model: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A2540',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A2540',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});

export default CarDetailsScreen;