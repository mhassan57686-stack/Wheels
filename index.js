/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
if (Platform.OS === 'android') {
  // Dynamically import on Android only to avoid initializing Firebase modules before iOS configure
  const setupAndroidMessaging = async () => {
    try {
      const messaging = (await import('@react-native-firebase/messaging')).default;
      const notifeeModule = await import('@notifee/react-native');
      const notifee = notifeeModule.default;
      const { AndroidImportance } = notifeeModule;

      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        try {
          const channelId = await notifee.createChannel({ id: 'chat', name: 'Chat', importance: AndroidImportance.HIGH });
          await notifee.displayNotification({
            title: remoteMessage?.notification?.title || 'New message',
            body: remoteMessage?.notification?.body || (remoteMessage?.data?.message || ''),
            android: { channelId },
            data: remoteMessage?.data || {},
          });
        } catch {}
      });

      messaging().onMessage(async (remoteMessage) => {
        try {
          const channelId = await notifee.createChannel({ id: 'chat', name: 'Chat', importance: AndroidImportance.HIGH });
          await notifee.displayNotification({
            title: remoteMessage?.notification?.title || 'New message',
            body: remoteMessage?.notification?.body || (remoteMessage?.data?.message || ''),
            android: { channelId },
            data: remoteMessage?.data || {},
          });
        } catch {}
      });
    } catch {}
  };
  setupAndroidMessaging();
}

AppRegistry.registerComponent(appName, () => App);
