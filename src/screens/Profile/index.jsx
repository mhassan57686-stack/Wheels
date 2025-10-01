import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const [name, setName] = useState('Name');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [cnic, setCnic] = useState('12345-6789012-3');
  const [address, setAddress] = useState('Block A, DHA Phase 5, Lahore');
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}style={styles.headerIcon}>
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Profile</Text>

          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Image
              source={require('../../assets/images/edit.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Profile Picture Section */}
          <View style={styles.profileSection}>
            <View style={styles.profilePicContainer}>
              <Image
                source={require('../../assets/images/user.png')}
                style={styles.profilePic}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Image
                  source={require('../../assets/images/camera.png')}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/images/user.png')}
                  style={styles.inputIcon}
                />
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

            {/* Phone Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/images/phone.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  editable={isEditing}
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* CNIC Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CNIC Number</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/images/card.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={cnic}
                  onChangeText={setCnic}
                  editable={isEditing}
                  placeholder="12345-6789012-3"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Address Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Image
                  source={require('../../assets/images/location.png')}
                  style={[styles.inputIcon, styles.locationIcon]}
                />
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

            {/* Save Button */}
            {isEditing && (
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Additional Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Image
                  source={require('../../assets/images/car.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>My Ads</Text>
              </View>
              <Image
                source={require('../../assets/images/back.png')}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Image
                  source={require('../../assets/images/heart.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Favorites</Text>
              </View>
              <Image
                source={require('../../assets/images/back.png')}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Image
                  source={require('../../assets/images/settings.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Settings</Text>
              </View>
              <Image
                source={require('../../assets/images/back.png')}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionItem, styles.logoutItem]}>
              <View style={styles.optionLeft}>
                <Image
                  source={require('../../assets/images/logout.png')}
                  style={[styles.optionIcon, styles.logoutIcon]}
                />
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