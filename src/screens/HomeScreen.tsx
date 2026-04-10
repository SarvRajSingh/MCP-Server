import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharacterCard } from '../components/CharacterCard';
import { useAppStore } from '../store/AppStore';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props): JSX.Element {
  const { state } = useAppStore();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>AI Companion</Text>
        <Pressable style={styles.createBtn} onPress={() => navigation.navigate('CharacterStudio')}>
          <Text style={styles.createText}>+ New</Text>
        </Pressable>
      </View>

      <FlatList
        data={state.characters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => navigation.navigate('Chat', { characterId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16, paddingTop: 58 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: 'white', fontSize: 30, fontWeight: '800' },
  createBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 },
  createText: { color: 'white', fontWeight: '700' }
});
