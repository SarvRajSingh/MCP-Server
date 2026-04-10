import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatBubble } from '../components/ChatBubble';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/AppStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export function ChatScreen({ route }: Props): JSX.Element {
  const { state, sendMessage } = useAppStore();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const character = useMemo(
    () => state.characters.find((x) => x.id === route.params.characterId),
    [state.characters, route.params.characterId]
  );

  if (!character) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Character not found.</Text>
      </View>
    );
  }

  const messages = state.chats[character.id] ?? [];

  const onSend = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    await sendMessage(character, text);
    setText('');
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatar}>{character.avatar}</Text>
        <View>
          <Text style={styles.name}>{character.name}</Text>
          <Text style={styles.tagline}>{character.tagline}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.messages}
      />

      {loading && <ActivityIndicator color="#93c5fd" style={{ marginBottom: 8 }} />}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Send a message..."
          placeholderTextColor="#64748b"
          value={text}
          onChangeText={setText}
          multiline
        />
        <Pressable style={styles.sendBtn} onPress={onSend}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 12 },
  header: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#1e293b'
  },
  avatar: { fontSize: 28 },
  name: { color: 'white', fontSize: 18, fontWeight: '700' },
  tagline: { color: '#94a3b8', maxWidth: 300 },
  messages: { paddingVertical: 12 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', marginTop: 6 },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: 'white',
    backgroundColor: '#1e293b'
  },
  sendBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#2563eb'
  },
  sendText: { color: 'white', fontWeight: '700' },
  empty: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#cbd5e1' }
});
