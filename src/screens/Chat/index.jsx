import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import io from 'socket.io-client';
import axios from 'axios';
import notifee, { AndroidImportance } from '@notifee/react-native';
import useAuthStore from '../../store/authStore'; // Your authStore

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { carId, carModel, otherUserId, otherUserName } = route.params;
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const flatListRef = useRef(null);

  // Aapke authStore se data le rahe hain
  const { token, isAuthenticated, user } = useAuthStore();

  const getBaseUrl = () => {
    return Platform.OS === 'ios' 
      ? 'http://localhost:5000' 
      : 'http://10.0.2.2:5000';
  };

  // Fetch messages function
  const fetchMessages = async () => {
    try {
      if (!token) {
        Alert.alert(
          'Login Required',
          'Please login to continue chatting',
          [
            {
              text: 'Cancel',
              onPress: () => navigation.goBack(),
              style: 'cancel'
            },
            {
              text: 'Login',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
        return;
      }

      console.log('Fetching messages with token from authStore');
      
      const response = await axios.get(
        `${getBaseUrl()}/api/chats/chat-messages/${carId}/${otherUserId}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Messages fetched successfully:', response.data.messages.length);
      setMessages(response.data.messages);
      
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to load messages. Please try again.');
      }
    }
  };

  // Get current user ID from store
  const getUserIdFromStore = () => {
    return user?._id || null;
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Auth store se check karte hain
        if (!isAuthenticated || !token) {
          Alert.alert(
            'Login Required',
            'Please login to start chatting',
            [
              {
                text: 'Cancel',
                onPress: () => navigation.goBack(),
                style: 'cancel'
              },
              {
                text: 'Login',
                onPress: () => navigation.navigate('Login')
              }
            ]
          );
          return;
        }

        // Store se user ID nikalte hain
        const userId = getUserIdFromStore();
        if (!userId) {
          throw new Error('User ID not found in token');
        }
        
        setCurrentUserId(userId);
        
        // Fetch existing messages
        await fetchMessages();
        
        // Initialize socket connection
        const newSocket = io(getBaseUrl(), {
          transports: ['websocket'],
          auth: {
            token: token
          }
        });

        newSocket.on('connect', () => {
          console.log('Connected to server');
          // Join the chat room
          newSocket.emit('join_chat', { 
            carId, 
            userId: userId,
            otherUserId 
          });
        });

        newSocket.on('receive_message', (message) => {
          console.log('New message received:', message);
          setMessages((previousMessages) => {
            const incomingId = String(message._id || message.id || '');
            const exists = previousMessages.some((m) => String(m._id || m.id || '') === incomingId && incomingId !== '');
            if (exists) return previousMessages;
            return [...previousMessages, message];
          });
        });

        newSocket.on('message_error', (error) => {
          Alert.alert('Error', error.error);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          Alert.alert('Connection Error', 'Failed to connect to chat server');
        });

        newSocket.on('unauthorized', () => {
          Alert.alert('Session Expired', 'Please login again');
          navigation.navigate('LoginScreen');
        });

        setSocket(newSocket);

      } catch (error) {
        console.error('Error initializing chat:', error);
        Alert.alert('Error', error.message || 'Failed to initialize chat');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [carId, otherUserId, isAuthenticated, token]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    if (!socket || !isAuthenticated || !currentUserId) {
      Alert.alert('Error', 'Please login to send messages');
      return;
    }

    try {
      const messageData = {
        carId,
        senderId: currentUserId,
        receiverId: otherUserId,
        text: newMessage.trim(),
        timestamp: new Date()
      };

      console.log('Sending message:', messageData);
      socket.emit('send_message', messageData);
      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  // Foreground local notification without Firebase
  useEffect(() => {
    const showLocalNotification = async (title, body) => {
      try {
        await notifee.createChannel({ id: 'chat', name: 'Chat', importance: AndroidImportance.HIGH });
        await notifee.displayNotification({
          title,
          body,
          android: { channelId: 'chat', pressAction: { id: 'default' } },
        });
      } catch (e) {}
    };
    if (!socket) return;
    const onReceive = (message) => {
      if (String(message.receiverId) === String(currentUserId)) {
        showLocalNotification('New message', message.text || '');
      }
    };
    socket.on('receive_message', onReceive);
    return () => socket.off('receive_message', onReceive);
  }, [socket, currentUserId]);

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = String(item.senderId) === String(currentUserId);
    
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.userMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
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
            <View style={styles.headerUser}>
              <Text style={styles.headerTitle}>{carModel}</Text>
            </View>
            <View style={styles.headerIcon} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00D9E1" />
            <Text style={styles.loadingText}>Loading chat...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

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
          <View style={styles.headerUser}>
            <Image
              source={require('../../assets/images/user.png')}
              style={styles.userIcon}
            />
            <View>
              <Text style={styles.headerTitle}>{carModel}</Text>
              <Text style={styles.subTitle}>Chat with {otherUserName}</Text>
            </View>
          </View>
          <View style={styles.headerIcon} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.container}>
            {messages.length === 0 ? (
              <View style={styles.emptyChatContainer}>
                <Text style={styles.emptyChatText}>No messages yet</Text>
                <Text style={styles.emptyChatSubText}>
                  Start the conversation by sending a message
                </Text>
              </View>
            ) : (
              // In your ChatScreen.jsx, update the FlatList keyExtractor:

<FlatList
  ref={flatListRef}
  data={messages}
  renderItem={renderMessageItem}
  keyExtractor={(item, index) => {
    const primary = String(item._id || item.id || '');
    if (primary) return primary;
    const ts = new Date(item.timestamp || 0).getTime();
    const sender = String(item.senderId || '');
    const textHead = (item.text || '').substring(0, 12);
    return `msg_${ts}_${sender}_${textHead}_${index}`;
  }}
  contentContainerStyle={styles.messageList}
  showsVerticalScrollIndicator={false}
/>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type your message..."
                placeholderTextColor="#999"
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={!newMessage.trim() || !isAuthenticated}
              >
                <Image
                  source={require('../../assets/images/send.png')}
                  style={[
                    styles.sendIcon,
                    (!newMessage.trim() || !isAuthenticated) && styles.sendIconDisabled,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  userIcon: {
    width: 28,
    height: 28,
    tintColor: '#00D9E1',
    resizeMode: 'contain',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F4F8',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyChatText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyChatSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  messageList: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: '#c1f9fcff',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#D0E8F2',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D0E8F2',
  },
  messageInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#00D9E1',
    resizeMode: 'contain',
  },
  sendIconDisabled: {
    tintColor: '#999',
  },
});

export default ChatScreen;