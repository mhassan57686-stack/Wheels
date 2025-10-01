import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatTimeAgo } from '../../utils/dateUtils'; 

const CarDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params; 

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
            <Image
              source={car.image}
              style={styles.carImage}
            />
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  carImage: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 20,
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