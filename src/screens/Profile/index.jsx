import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import useAuthStore from '../../store/authStore';
import axios from 'axios';

const Profile = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();
  const { token, clearAuth } = useAuthStore();

  const getBaseUrl = () => {
    if (Platform.OS === 'ios') {
      return 'http://localhost:5000'; // Replace with your machine's IP for physical iOS devices, e.g., 'http://192.168.1.100:5000'
    } else {
      return 'http://10.0.2.2:5000'; // Android emulator
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.log('No token available for profile fetch');
        Alert.alert('Error', 'Please log in to view profile');
        navigation.replace('LoginScreen');
        return;
      }

      const url = `${getBaseUrl()}/api/auth/profile`;
      console.log('Fetching profile from:', url);
      console.log('Token:', token.substring(0, 20) + '...');

      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Profile fetch response:', response.data);
        const userData = response.data.user;
        setName(userData.name || '');
        setPhone(userData.phone || '');
        setCnic(userData.cnic || '');
        setAddress(userData.address || '');
        setProfileImage(userData.profileImage || null);
      } catch (error) {
        console.error('Error fetching profile:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        if (error.response?.status === 401) {
          Alert.alert('Session Expired', 'Please log in again');
          clearAuth();
          navigation.replace('LoginScreen');
        } else {
          Alert.alert('Error', error.response?.data?.message || 'Failed to fetch profile data');
        }
      }
    };

    fetchProfile();
  }, [token, navigation, clearAuth]);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        let permission = Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission',
          message: 'App needs access to your photos to upload profile picture',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to upload photos');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.5,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, async (response) => {
      console.log('Image Picker Response:', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error:', response.errorCode, response.errorMessage);
        Alert.alert('Error', `Failed to pick image: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        console.log('Selected asset:', asset);
        setProfileImage(asset.uri); // Temporary local URI for preview
        await uploadImage(asset);
      } else {
        console.log('No assets returned');
        Alert.alert('Error', 'No image selected');
      }
    });
  };

  const uploadImage = async (asset) => {
    if (!token) {
      Alert.alert('Error', 'Please log in to upload image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profileImage', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `profile_${Date.now()}.jpg`,
      });

      console.log('Uploading image to:', `${getBaseUrl()}/api/auth/upload-profile-image`);
      const response = await axios.post(
        `${getBaseUrl()}/api/auth/upload-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Image upload response:', response.data);
      // Validate the response
      if (!response.data.profileImage || typeof response.data.profileImage !== 'string' || response.data.profileImage.trim() === '') {
        throw new Error('Invalid profile image path received from server');
      }

      const newImagePath = response.data.profileImage;
      console.log('Setting profile image:', newImagePath);
      setProfileImage(newImagePath);
      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload image');
      setProfileImage(null); // Revert to null on failure
    }
  };

  const handleSave = async () => {
    if (!token) {
      Alert.alert('Error', 'Please log in to save changes');
      navigation.replace('LoginScreen');
      return;
    }

    if (!name || !phone || !cnic || !address) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const cnicRegex = /^\d{5}-\d{7}-\d$/;
    const phoneRegex = /^\+92 \d{3} \d{7}$/;
    if (!cnicRegex.test(cnic)) {
      Alert.alert('Error', 'Invalid CNIC format (e.g., 12345-6789012-3)');
      return;
    }
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Invalid phone format (e.g., +92 300 1234567)');
      return;
    }

    try {
      console.log('Updating profile with data:', { name, phone, cnic, address });
      const response = await axios.put(
        `${getBaseUrl()}/api/auth/profile`,
        { name, phone, cnic, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Profile update response:', response.data);

      const updatedUser = response.data.user;
      setName(updatedUser.name);
      setPhone(updatedUser.phone);
      setCnic(updatedUser.cnic);
      setAddress(updatedUser.address);
      setProfileImage(updatedUser.profileImage || null);

      setIsEditing(false);
      Alert.alert('Success', response.data.message || 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please log in again');
        clearAuth();
        navigation.replace('LoginScreen');
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
      }
    }
  };

  const handleLogout = () => {
    console.log('Logging out, clearing token...');
    clearAuth();
    navigation.replace('LoginScreen');
  };

  // Updated to handle server URLs correctly
  const getImageSource = () => {
    if (profileImage && typeof profileImage === 'string' && profileImage.trim() !== '') {
      // If profileImage is a local URI (file://) or already a full URL (http://), use it directly
      const imageUrl = profileImage.startsWith('file://') || profileImage.startsWith('http')
        ? profileImage
        : `${getBaseUrl()}/${profileImage}`; // Prepend base URL for server paths
      console.log('Image URL:', imageUrl);
      return { uri: imageUrl };
    }
    console.log('Using default image: profileImage is', profileImage);
    return require('../../assets/images/user.png');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <Image source={require('../../assets/images/back.png')} style={styles.iconImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.headerIcon} onPress={() => setIsEditing(!isEditing)}>
            <Image source={require('../../assets/images/edit.png')} style={styles.iconImage} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={styles.profilePicContainer}>
              <Image
                source={getImageSource()}
                style={styles.profilePic}
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <Image source={require('../../assets/images/camera.png')} style={styles.cameraIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/images/user.png')} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  editable={isEditing}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/images/phone.png')} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  editable={isEditing}
                  placeholder="Enter phone number (e.g., +92 300 1234567)"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CNIC Number</Text>
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/images/card.png')} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={cnic}
                  onChangeText={setCnic}
                  editable={isEditing}
                  placeholder="Enter CNIC (e.g., 12345-6789012-3)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Image source={require('../../assets/images/location.png')} style={[styles.inputIcon, styles.locationIcon]} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={address}
                  onChangeText={setAddress}
                  editable={isEditing}
                  placeholder="Enter your address"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {isEditing && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Image source={require('../../assets/images/car.png')} style={styles.optionIcon} />
                <Text style={styles.optionText}>My Ads</Text>
              </View>
              <Image source={require('../../assets/images/back.png')} style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Image source={require('../../assets/images/heart.png')} style={styles.optionIcon} />
                <Text style={styles.optionText}>Favorites</Text>
              </View>
              <Image source={require('../../assets/images/back.png')} style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Image source={require('../../assets/images/settings.png')} style={styles.optionIcon} />
                <Text style={styles.optionText}>Settings</Text>
              </View>
              <Image source={require('../../assets/images/back.png')} style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionItem, styles.logoutItem]} onPress={handleLogout}>
              <View style={styles.optionLeft}>
                <Image source={require('../../assets/images/logout.png')} style={[styles.optionIcon, styles.logoutIcon]} />
                <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
              </View>
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
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#00D9E1',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00D9E1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  formContainer: {
    padding: 20,
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
  locationIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
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
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 24,
    height: 24,
    tintColor: '#0A2540',
    marginRight: 12,
    resizeMode: 'contain',
  },
  optionText: {
    fontSize: 16,
    color: '#0A2540',
    fontWeight: '500',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
    resizeMode: 'contain',
  },
  logoutItem: {
    marginTop: 10,
  },
  logoutIcon: {
    tintColor: '#FF4444',
  },
  logoutText: {
    color: '#FF4444',
  },
});

export default Profile;