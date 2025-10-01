import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const initialMessages = [
  {
    id: '1',
    text: 'Hi, is the Toyota Corolla 2021 still available?',
    sender: 'other',
    time: '10:30 AM',
  },
  {
    id: '2',
    text: 'Yes, it’s still available. Are you interested in a test drive?',
    sender: 'user',
    time: '10:32 AM',
  },
  {
    id: '3',
    text: 'Great! Can we schedule it for tomorrow?',
    sender: 'other',
    time: '10:35 AM',
  },
];

const ChatScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: (messages.length + 1).toString(),
        text: newMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      // Simulate a reply from the other user after a short delay
      setTimeout(() => {
        const replyMsg = {
          id: (messages.length + 2).toString(),
          text: 'Thanks for your message! I’ll get back to you soon.',
          sender: 'other',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, replyMsg]);
      }, 1000);
    }
  };

  const renderMessageItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
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
          <View style={styles.headerUser}>
            <Image
              source={require('../../assets/images/user.png')}
              style={styles.userIcon}
            />
            <Text style={styles.headerTitle}>Buyer - Toyota Corolla</Text>
          </View>
          <View style={styles.headerIcon} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.container}>
            <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
             
            />

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
                disabled={!newMessage.trim()}
              >
                <Image
                  source={require('../../assets/images/send.png')}
                  style={[
                    styles.sendIcon,
                    !newMessage.trim() && styles.sendIconDisabled,
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
    marginHorizontal: 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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