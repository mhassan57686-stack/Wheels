import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

const PostScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addNewCar } = route.params;
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState(''); 
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (model.trim() && price.trim() && location.trim()) {
      const newCar = {
        id: (Math.random() * 1000).toString(),
        model,
        price: `PKR ${price}`,
        location,
        description,
        image: image || require('../../assets/images/honda.png'),
        timestamp: new Date().toISOString(),
      };
      addNewCar(newCar);
      setModel('');
      setPrice('');
      setLocation('');
      setDescription(''); 
      setImage(null);
      navigation.navigate('Home');
    }
  };

  const handleImageUpload = () => {
    console.log('Image upload triggered');
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
                    image
                      ? image
                      : require('../../assets/images/camera.png')
                  }
                  style={styles.imageUploadIcon}
                />
                <Text style={styles.imageUploadText}>
                  {image ? 'Change Image' : 'Upload Car Image'}
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