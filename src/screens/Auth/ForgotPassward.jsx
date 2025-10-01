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

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleSendResetLink = () => {
    if (email.trim()) {
      // Placeholder for sending reset link (e.g., API call)
      console.log('Reset link sent to:', email);
      navigation.replace('OTP'); // Return to Login screen after success
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/MetaWheel.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Forgot Password</Text>
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

            <TouchableOpacity
              style={[
                styles.resetButton,
                !email.trim() && styles.resetButtonDisabled,
              ]}
              onPress={handleSendResetLink}
              disabled={!email.trim()}
            >
              <Text style={styles.resetButtonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleBackToLogin} style={styles.backLinkContainer}>
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
  logo: {
    width: 200,
    height: 230,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
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
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  resetButton: {
    backgroundColor: '#142F50',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    //marginTop: 25,
   
  },
  resetButtonDisabled: {
    backgroundColor: '#142F50',
    shadowOpacity: 0,
    elevation: 0,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backLinkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backLinkText: {
    color: '#a7d5ddff',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default ForgotPassword;