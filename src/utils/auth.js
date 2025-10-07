import AsyncStorage from '@react-native-async-storage/async-storage';

// Store token after login/signup
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Store user data after login/signup
export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

// Get token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Get user ID
export const getUserId = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      return parsedData.userId || parsedData._id || parsedData.id;
    }
    return null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// Remove token (for logout)
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};