import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const ChatListScreen = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const baseUrl = 'http://10.0.2.2:5000';
  const ws = useRef(null);
  const userId = useRef(null);

  useEffect(() => {
    const initializeChats = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        // Get current user ID
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          userId.current = user._id;
        }

        // Fetch chats
        const res = await fetch(`${baseUrl}/api/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load chats');
        const data = await res.json();
        setChats(data);

        // Initialize WebSocket connection
        initializeWebSocket(token);

      } catch (err) {
        console.error('Chat load error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeChats();

    // Cleanup WebSocket on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [navigation]);

  // Refresh chats when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      refreshChats();
    }
  }, [isFocused]);

  const initializeWebSocket = (token) => {
    // Replace with your WebSocket URL (assuming you're using the same base URL)
    const wsUrl = baseUrl.replace('http', 'ws') + '/ws';
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      // Send authentication token
      ws.current.send(JSON.stringify({ type: 'auth', token }));
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleNewMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };
  };

  const handleNewMessage = (newMessage) => {
    console.log('New message received:', newMessage);
    
    setChats(prevChats => {
      // Check if this message belongs to an existing conversation
      const existingChatIndex = prevChats.findIndex(chat => 
        chat._id === newMessage.conversationId || 
        (chat.carId === newMessage.carId && 
         (chat.sellerId === newMessage.senderId || chat.buyerId === newMessage.senderId))
      );

      if (existingChatIndex !== -1) {
        // Update existing chat
        const updatedChats = [...prevChats];
        const updatedChat = {
          ...updatedChats[existingChatIndex],
          lastMessage: newMessage.text,
          timestamp: newMessage.timestamp,
          unreadCount: (updatedChats[existingChatIndex].unreadCount || 0) + 
                      (newMessage.receiverId === userId.current ? 1 : 0)
        };
        
        // Move updated chat to top
        updatedChats.splice(existingChatIndex, 1);
        return [updatedChat, ...updatedChats];
      } else {
        // This is a new conversation, we need to fetch the conversation details
        refreshChats();
        return prevChats;
      }
    });
  };

  const refreshChats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${baseUrl}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setChats(data);
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
          conversationId: item._id,
          sellerName: item.seller?.name || 'Seller',
          carModel: item.car?.model || 'Car',
        })
      }
    >
      <Image
        source={require('../../assets/images/chat.png')}
        style={styles.icon}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.name}>
          {item.seller?.name || item.buyer?.name || 'Unknown User'}
        </Text>
        <Text style={styles.carModel}>
          {item.car?.model || 'Unknown Car'}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage || 'No messages yet'}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.time}>
          {item.timestamp ? formatTime(item.timestamp) : ''}
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
            keyExtractor={item => item._id}
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