import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../types/models';

export function ChatBubble({ message }: { message: ChatMessage }): JSX.Element {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.wrap, isUser ? styles.right : styles.left]}>
      <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
        <Text style={styles.text}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 4, flexDirection: 'row' },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '82%', padding: 10, borderRadius: 12 },
  user: { backgroundColor: '#2563eb' },
  assistant: { backgroundColor: '#334155' },
  text: { color: 'white', fontSize: 15 }
});
