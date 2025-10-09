import React, { useEffect } from 'react'
import {NavigationContainer} from "@react-navigation/native";
import MyStack from "./src/navigation/MyStack";

import {SocketProvider} from "./src/utils/useSocket";
import notifee, { AndroidImportance } from '@notifee/react-native';
import OneSignal from 'react-native-onesignal';
import useAuthStore from './src/store/authStore';

export default function App() {
  const { isAuthenticated, token, user } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        await notifee.createChannel({ id: 'chat', name: 'Chat', importance: AndroidImportance.HIGH });
      } catch {}
    })();
  }, []);

  useEffect(() => {
    try {
      const appId = 'a9bf72ec-682c-48ff-89cb-5f647ac32db7';
      if (!appId) return;
      if (OneSignal && OneSignal.initialize) {
        OneSignal.initialize(appId);
        if (OneSignal.Notifications?.requestPermission) {
          OneSignal.Notifications.requestPermission(true);
        }
        if (isAuthenticated && user?._id && OneSignal.login) {
          OneSignal.login(String(user._id));
        }
      }
    } catch (e) {
      // Avoid crashing if native module not linked on iOS simulator
    }
  }, [isAuthenticated, user?._id]);
  return (
    <SocketProvider>
      <NavigationContainer>
        <MyStack/>
      </NavigationContainer>
    </SocketProvider>
  );
};