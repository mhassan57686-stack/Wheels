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
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Dynamic base URL
  const getBaseUrl = () => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000'; // Android emulator
    } else {
      return 'http://localhost:5000'; // iOS simulator
    }
  };

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const baseUrl = getBaseUrl();

    console.log('Request body:', { email, password, confirmPassword });
    console.log('API URL:', `${baseUrl}/api/auth/signup`);

    try {
      const response = await axios({
        method: 'POST',
        url: `${baseUrl}/api/auth/signup`,
        data: { email, password, confirmPassword },
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Signup response:', response.data);
      console.log('JWT Token:', response.data.token); // Log JWT token

      if (response.status === 201) {
        setAuth(response.data.token); // Store token in Zustand
        Alert.alert('Success', response.data.message);
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to sign up';
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please check:\n1. Server is running\n2. Network connection';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.log('Server error response:', error.response.data);
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Login with Google clicked');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create your account</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.signUpButtonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
              <Image
                source={require('../../assets/images/google.png')}
                style={styles.googleLogo}
              />
              <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.backLinkContainer}>
            <Text style={styles.backLinkText}>Back to Login</Text>
          </TouchableOpacity>

          
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#142F50',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#142F50',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 50,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0A2540',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#142F50',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  signUpButton: {
    backgroundColor: '#142F50',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonDisabled: {
    backgroundColor: '#999',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backLinkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backLinkText: {
    color: 'rgba(150, 169, 173, 1)',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#142F50',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  debugInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  debugText: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default Signup;