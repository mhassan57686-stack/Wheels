import React, { useState, useRef } from 'react';
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

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']); // Array for 4 OTP digits
  const inputRefs = useRef([useRef(), useRef(), useRef(), useRef()]); // Refs for each input
  const navigation = useNavigation();

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to next input if a digit is entered and it's not the last field
    if (text && index < 3) {
      inputRefs.current[index + 1].current.focus();
    }
    // Clear the current input if backspace is pressed and it's empty
    else if (!text && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
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
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>A 4-digit code has been sent to your email</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  ref={inputRefs.current[index]}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Verify OTP</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}style={styles.backLinkContainer}>
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
    height: 180,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#142F50',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#0A2540',
  },
  verifyButton: {
    backgroundColor: '#142F50',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backLinkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backLinkText: {
    color: '#9fb3b6ff',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default OTP;