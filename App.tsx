import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import {NavigationContainer} from "@react-navigation/native";
import MyStack from "./src/navigation/MyStack";

import {SocketProvider} from "./src/utils/useSocket";
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import useAuthStore from './src/store/authStore';

export default function App() {
  const { isAuthenticated, token, user } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        await notifee.createChannel({ id: 'chat', name: 'Chat', importance: AndroidImportance.HIGH });
        // Android 13+ explicit permission
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          await notifee.requestPermission();
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'ios') return; // Skip iOS until GoogleService-Info.plist is added
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!enabled) return;

        const fcmToken = await messaging().getToken();
        if (!fcmToken) return;

        if (isAuthenticated && token) {
          try {
            await fetch((Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000') + '/api/users/device-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ token: fcmToken }),
            });
          } catch {}
        }
      } catch {}
    })();

    if (Platform.OS === 'ios') return () => {};
    const unsubscribeRefresh = messaging().onTokenRefresh(async (newToken) => {
      try {
        if (isAuthenticated && token && newToken) {
          await fetch((Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000') + '/api/users/device-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ token: newToken }),
          });
        }
      } catch {}
    });

    return () => {
      unsubscribeRefresh();
    };
  }, [isAuthenticated, token]);
  return (
    <SocketProvider>
      <NavigationContainer>
        <MyStack/>
      </NavigationContainer>
    </SocketProvider>
  );
};