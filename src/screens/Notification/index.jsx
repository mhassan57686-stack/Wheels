import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const notificationData = [
  {
    id: '1',
    title: 'New Offer Received',
    message: 'You received an offer for your Toyota Corolla 2021 listing.',
    time: '2 hours ago',
    icon: require('../../assets/images/offer.png'),
  },
  {
    id: '2',
    title: 'Ad Approved',
    message: 'Your Honda City 2022 ad has been approved and is now live.',
    time: '5 hours ago',
    icon: require('../../assets/images/check.png'),
  },
  {
    id: '3',
    title: 'Message from Buyer',
    message: 'A buyer has sent you a message regarding your Kia Sportage.',
    time: 'Yesterday',
    icon: require('../../assets/images/message.png'),
  },
  {
    id: '4',
    title: 'Price Update Alert',
    message: 'Price drop detected for similar cars in your area.',
    time: '2 days ago',
    icon: require('../../assets/images/price.png'),
  },
];

const Notification = () => {
  const navigation = useNavigation();

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Image source={item.icon} style={styles.notificationIcon} />
      <View style={styles.notificationInfo}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.headerIcon}
          >
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Notifications</Text>

          <View style={styles.headerIcon} />
        </View>

        <View style={styles.container}>
          <FlatList
            data={notificationData}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>No notifications found</Text>}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A2540',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A2540',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
   
  },
  notificationIcon: {
    width: 40,
    height: 40,
    tintColor: '#00D9E1',
    marginRight: 12,
    resizeMode: 'contain',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A2540',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  list: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default Notification;