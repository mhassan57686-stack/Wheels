// Updated Bottom.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/Home/index.jsx';
import Post from '../screens/Post/index.jsx';
import ChatListScreen from '../screens/Chat/ChatListScreen.jsx'; // Updated import to ChatListScreen

const Tab = createBottomTabNavigator();

const CustomPlusButton = ({ addNewCar }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.plusButtonContainer}
      onPress={() => navigation.navigate('Post', { addNewCar })}
    >
      <View style={styles.plusButton}>
        <View style={styles.plusHorizontal} />
        <View style={styles.plusVertical} />
      </View>
    </TouchableOpacity>
  );
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = require('../assets/images/home.png');
          } else if (route.name === 'Post') {
            return null; 
          } else if (route.name === 'Chat') {
            iconSource = require('../assets/images/chat.png');
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: 26,
                height: 26,
                tintColor: '#FFFFFF',
                opacity: focused ? 1 : 0.6,
              }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#8B9AA3',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarButton: (props) => <TouchableOpacity {...props} /> }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarButton: (props) => <CustomPlusButton {...props} />,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen} // Updated to ChatListScreen
        options={{
          tabBarStyle: { display: 'none' }, // Optional: Hide tab bar if not needed, but keep as is if you want it visible
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0B2845',
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  plusButtonContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00D9FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e1f3f4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 8,
    borderColor: '#e2f3f8ff',
    marginBottom:18
  },
  plusHorizontal: {
    position: 'absolute',
    width: 24,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  plusVertical: {
    position: 'absolute',
    width: 3,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});