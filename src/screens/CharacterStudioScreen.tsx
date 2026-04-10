import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/AppStore';
import { CharacterTone } from '../types/models';
import { characterFormSchema } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterStudio'>;

const tones: CharacterTone[] = ['friendly', 'mentor', 'playful', 'romantic', 'professional'];

export function CharacterStudioScreen({ navigation }: Props): JSX.Element {
  const { createCharacter } = useAppStore();
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [backstory, setBackstory] = useState('');
  const [tone, setTone] = useState<CharacterTone>('friendly');
  const [interestsText, setInterestsText] = useState('');
  const [avatar, setAvatar] = useState('🙂');

  const interests = useMemo(
    () => interestsText.split(',').map((x) => x.trim()).filter(Boolean),
    [interestsText]
  );

  const handleSave = () => {
    const parsed = characterFormSchema.safeParse({ name, tagline, backstory, tone, interests, avatar });
    if (!parsed.success) {
      Alert.alert('Invalid profile', 'Please complete all fields with valid values.');
      return;
    }

    createCharacter(parsed.data);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Avatar Emoji</Text>
      <TextInput style={styles.input} value={avatar} onChangeText={setAvatar} placeholder="🙂" placeholderTextColor="#64748b" />

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Astra" placeholderTextColor="#64748b" />

      <Text style={styles.label}>Tagline</Text>
      <TextInput style={styles.input} value={tagline} onChangeText={setTagline} placeholder="Supportive guide for late-night chats" placeholderTextColor="#64748b" />

      <Text style={styles.label}>Backstory</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={backstory}
        onChangeText={setBackstory}
        placeholder="Describe personality, history, and boundaries..."
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Tone</Text>
      <View style={styles.row}>
        {tones.map((item) => (
          <Pressable
            key={item}
            onPress={() => setTone(item)}
            style={[styles.pill, tone === item && styles.pillActive]}
          >
            <Text style={[styles.pillText, tone === item && styles.pillTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Interests (comma separated)</Text>
      <TextInput
        style={styles.input}
        value={interestsText}
        onChangeText={setInterestsText}
        placeholder="music, books, productivity"
        placeholderTextColor="#64748b"
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Character</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 40 },
  label: { color: '#cbd5e1', marginBottom: 6, marginTop: 12, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  textArea: { minHeight: 110, textAlignVertical: 'top' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderColor: '#475569', borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  pillActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  pillText: { color: '#cbd5e1' },
  pillTextActive: { color: 'white' },
  saveButton: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    paddingVertical: 13,
    alignItems: 'center'
  },
  saveText: { color: '#052e16', fontWeight: '800' }
});
