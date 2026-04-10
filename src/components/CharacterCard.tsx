import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Character } from '../types/models';

export function CharacterCard({
  character,
  onPress
}: {
  character: Character;
  onPress: () => void;
}): JSX.Element {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.avatar}>{character.avatar}</Text>
      <View style={styles.body}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.tagline}>{character.tagline}</Text>
        <Text style={styles.meta}>{character.interests.join(' • ')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    marginBottom: 10
  },
  avatar: { fontSize: 34 },
  body: { flex: 1 },
  name: { color: 'white', fontSize: 18, fontWeight: '700' },
  tagline: { color: '#cbd5e1', marginTop: 4 },
  meta: { color: '#94a3b8', marginTop: 6, fontSize: 12 }
});
