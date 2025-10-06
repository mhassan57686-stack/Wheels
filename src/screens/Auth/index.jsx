import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import useAuthStore from '../../store/authStore';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Start logo fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Check authentication after a short delay
    const timer = setTimeout(() => {
      console.log('Zustand state on app start:', useAuthStore.getState());
      if (isAuthenticated && token) {
        console.log('Token found in storage:', token);
        navigation.replace('Main');
      } else {
        console.log('No token found');
        navigation.replace('LoginScreen');
      }
    }, 3000); // Reduced to 3 seconds for faster UX

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, token, isAuthenticated]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#0A2540', '#1A3A60']}
          style={styles.container}
        >
          <View style={styles.content}>
            <Animated.Image
              source={require('../../assets/images/logo.png')}
              style={[styles.logo, { opacity: fadeAnim }]}
            />
          </View>
        </LinearGradient>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 250,
    resizeMode: 'contain',
    tintColor: '#ffffff',
    marginBottom: 20,
  },
});

export default SplashScreen;