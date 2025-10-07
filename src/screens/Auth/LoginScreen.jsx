import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  // Dynamic base URL
  const getBaseUrl = () => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000'; // Android emulator
    } else {
      return 'http://localhost:5000'; // iOS simulator
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const baseUrl = getBaseUrl();

    console.log('Request body:', { email, password });
    console.log('API URL:', `${baseUrl}/api/auth/login`);

    try {
      const response = await axios({
        method: 'POST',
        url: `${baseUrl}/api/auth/login`,
        data: { email, password },
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login response:', response.data);
      console.log('JWT Token:', response.data.token); 

      if (response.status === 200) {
        setAuth(response.data.token, response.data.user);
        console.log('JWT Token:', response.data.token);
        Alert.alert('Success', response.data.message);
        navigation.replace('Main');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to log in';
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  const handleGoogleLogin = () => {
    console.log('Login with Google clicked');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
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
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeIconContainer} onPress={togglePasswordVisibility}>
                  <Image
                    source={require('../../assets/images/eye.png')}
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.loginButton,
                (loading || !(email.trim() && password.trim())) && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading || !(email.trim() && password.trim())}
            >
              <Text style={styles.loginButtonText}>{loading ? 'Loading...' : 'Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
              <Image
                source={require('../../assets/images/google.png')}
                style={styles.googleLogo}
              />
              <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableWithoutFeedback onPress={handleSignUp}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>Server URL: {getBaseUrl()}</Text>
          </View>
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
  logo: {
    width: 150,
    height: 200,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  formContainer: {
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
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
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  eyeIconContainer: {
    padding: 8,
  },
  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: '#142F50',
    resizeMode: 'contain',
  },
  loginButton: {
    backgroundColor: '#142F50',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#999',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordText: {
    color: '#76898dff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: -10,
    textDecorationLine: 'underline',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
  },
  signupLink: {
    color: '#b9bbbbff',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    marginLeft: 5,
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

export default LoginScreen;