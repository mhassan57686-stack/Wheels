// Updated PostScreen.js with multiple image upload and backend integration
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import useAuthStore from '../../store/authStore';
import axios from 'axios';

const PostScreen = () => {
  const navigation = useNavigation();
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // Array for multiple images
  const { token } = useAuthStore();

  const getBaseUrl = () => {
    if (Platform.OS === 'ios') {
      return 'http://localhost:5000';
    } else {
      return 'http://10.0.2.2:5000';
    }
  };

  const handleSubmit = async () => {
    if (model.trim() && price.trim() && location.trim()) {
      try {
        const formData = new FormData();
        formData.append('model', model);
        formData.append('price', `PKR ${price}`);
        formData.append('location', location);
        formData.append('description', description);

        // Append multiple images
        images.forEach((asset, index) => {
          formData.append('images', {
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            name: asset.fileName || `image_${index + 1}.jpg`,
          });
        });

        const response = await axios.post(
          `${getBaseUrl()}/api/cars/post-ad`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Post response:', response.data);
        Alert.alert('Success', 'Ad posted successfully');
        setModel('');
        setPrice('');
        setLocation('');
        setDescription('');
        setImages([]);
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error posting ad:', error.response?.data || error.message);
        Alert.alert('Error', error.response?.data?.message || 'Failed to post ad');
      }
    } else {
      Alert.alert('Error', 'Please fill all required fields');
    }
  };

  const handleImageUpload = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      maxWidth: 1000,
      maxHeight: 1000,
      selectionLimit: 0, // 0 for unlimited selection
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error:', response.errorCode, response.errorMessage);
        Alert.alert('Error', `Failed to pick images: ${response.errorMessage}`);
      } else if (response.assets) {
        setImages(response.assets); // Set array of selected images
        console.log('Selected images:', response.assets);
      }
    });
  };

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
          <Text style={styles.headerTitle}>Post New Ad</Text>
          <View style={styles.headerIcon} />
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.imageSection}>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={handleImageUpload}
              >
                <Image
                  source={
                    images.length > 0
                      ? { uri: images[0].uri } // Show first image as preview
                      : require('../../assets/images/camera.png')
                  }
                  style={styles.imageUploadIcon}
                />
                <Text style={styles.imageUploadText}>
                  {images.length > 0 ? `Change Images (${images.length} selected)` : 'Upload Car Images'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Car Model</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/images/car.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={model}
                  onChangeText={setModel}
                  placeholder="Enter car model (e.g., Toyota Corolla 2021)"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price (PKR)</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/images/price.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="Enter price (e.g., 67 00 000)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/images/location.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter location (e.g., Karachi)"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Image
                  source={require('../../assets/images/description.png')}
                  style={[styles.inputIcon, styles.descriptionIcon]}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter car description (e.g., condition, features)"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !(model.trim() && price.trim() && location.trim()) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!(model.trim() && price.trim() && location.trim())}
            >
              <Text style={styles.submitButtonText}>Post Ad</Text>
            </TouchableOpacity>
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
  formContainer: {
    padding: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageUploadButton: {
    width: 150,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0E8F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imageUploadIcon: {
    width: 50,
    height: 50,
    tintColor: '#00D9E1',
    resizeMode: 'contain',
  },
  imageUploadText: {
    fontSize: 14,
    color: '#0A2540',
    marginTop: 10,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A2540',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D0E8F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
  inputIcon: {
    width: 20,
    height: 20,
    tintColor: '#00D9E1',
    marginRight: 12,
    resizeMode: 'contain',
  },
  descriptionIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#00D9E1',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#00D9E1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostScreen;