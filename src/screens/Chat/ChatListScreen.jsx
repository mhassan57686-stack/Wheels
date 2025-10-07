import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import useAuthStore from '../../store/authStore';

const ChatListScreen = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const socket = useRef(null);

  const { isAuthenticated, token, user } = useAuthStore();
  const userId = user?._id;

  const baseUrl = Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';

  useEffect(() => {
    if (isFocused && !isAuthenticated) {
      navigation.navigate('LoginScreen');
    }
  }, [isFocused, isAuthenticated, navigation]);

  useEffect(() => {
    const initializeChats = async () => {
      try {
        if (!token) {
          return;
        }

        if (isFocused) {
          await refreshChats();
        }
        initializeSocket(token);

      } catch (err) {
        console.error('Chat load error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused && token) {
      initializeChats();
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [isFocused, token]);

  const initializeSocket = (token) => {
    if (socket.current) {
      socket.current.off('receive_message'); // Remove previous listeners
      socket.current.off('connect');
      socket.current.off('connect_error');
      socket.current.off('disconnect');
      socket.current.disconnect();
    }

    socket.current = io(baseUrl, {
      transports: ['websocket'],
      auth: { token },
    });

    socket.current.on('connect', () => {
      console.log(`Socket connected in ChatListScreen with ID: ${socket.current.id}`);
    });

    socket.current.on('receive_message', (newMessage) => {
      console.log('New message received in ChatListScreen:', newMessage);
      handleNewMessage(newMessage);
    });

    socket.current.on('connect_error', (error) => {
      console.error('Socket connection error in ChatListScreen:', error);
    });

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected in ChatListScreen');
    });
  };

  const handleNewMessage = async (newMessage) => {
    try {
      // Check if the message is relevant to the current user
      if (newMessage.senderId === userId || newMessage.receiverId === userId) {
        await refreshChats(); // Fetch the latest chat list
      }
    } catch (error) {
      console.error('Error handling new message in ChatListScreen:', error);
    }
  };

  const refreshChats = async () => {
    try {
      if (!token) return;

      const response = await fetch(`${baseUrl}/api/auth/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data?.chats || []);
      } else {
        console.error('Failed to fetch chats:', response.status);
      }
    } catch (error) {
      console.error('Error refreshing chats:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          carId: item.carId,
          carModel: item.carModel,
          otherUserId: item.otherUserId,
          otherUserName: item.otherUserName,
        })
      }
    >
      <Image
        source={require('../../assets/images/chat.png')}
        style={styles.icon}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.name}>
          {item.otherUserName || 'Unknown User'}
        </Text>
        <Text style={styles.carModel}>
          {item.carModel || 'Unknown Car'}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage || 'No messages yet'}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.time}>
          {item.lastMessageTime ? formatTime(item.lastMessageTime) : ''}
        </Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {item.unreadCount > 9 ? '9+' : item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#00D9E1" />
        ) : chats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Chats Found</Text>
          </View>
        ) : (
          <FlatList
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id || `${index}`}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#E8F4F8', 
    padding: 10 
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: { 
    width: 50, 
    height: 50, 
    marginRight: 15, 
    tintColor: '#00D9E1' 
  },
  chatInfo: {
    flex: 1,
  },
  name: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0A2540' 
  },
  carModel: { 
    fontSize: 14, 
    color: '#666',
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: '#00D9E1',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { 
    fontSize: 16, 
    color: '#888' 
  },
});

export default ChatListScreen;