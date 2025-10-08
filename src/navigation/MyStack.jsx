import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '../navigation/Bottom'; 
import Profile from '../screens/Profile/index';
import Notification from '../screens/Notification';
import ChatScreen from '../screens/Chat/index';
import CarDetailsScreen from '../screens/Home/CarDetailsScreen';
import SplashScreen from '../screens/Auth/index';
import LoginScreen from '../screens/Auth/LoginScreen';
import ForgotPassword from '../screens/Auth/ForgotPassward';
import OTP from '../screens/Auth/OTP';
import Signup from '../screens/Auth/Signup';
import ChatListScreen from '../screens/Chat/ChatListScreen.jsx';
import Favorites from '../screens/Profile/Favorites.jsx';
import MyAds from '../screens/Profile/MyAds.jsx';
const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="Signup" component={Signup} />

        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OTP" component={OTP} />




      <Stack.Screen name="Main" component={BottomTabNavigator} />



     <Stack.Screen name="Profile" component={Profile} />
     <Stack.Screen name="Notification" component={Notification} />
 <Stack.Screen name="ChatScreen" component={ChatScreen} />
 <Stack.Screen name="ChatListScreen" component={ChatListScreen} />

  <Stack.Screen name="CarDetailsScreen" component={CarDetailsScreen} />
  <Stack.Screen name="Favorites" component={Favorites} />
    <Stack.Screen name="MyAds" component={MyAds} />


    </Stack.Navigator>
  );
};

export default MyStack;