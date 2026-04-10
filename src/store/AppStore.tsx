import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { defaultCharacters } from '../data/defaultCharacters';
import { generateCompanionReply } from '../services/aiClient';
import { Character, ChatMessage, CharacterTone, PersistedState } from '../types/models';
import { messageSchema } from '../utils/validation';

const STORAGE_KEY = 'ai-companion-state-v1';
const STATE_VERSION = 1;

type State = PersistedState & {
  loading: boolean;
};

type CharacterInput = {
  name: string;
  tagline: string;
  backstory: string;
  tone: CharacterTone;
  interests: string[];
  avatar: string;
};

type Action =
  | { type: 'hydrate'; payload: PersistedState }
  | { type: 'setLoading'; payload: boolean }
  | { type: 'addCharacter'; payload: Character }
  | { type: 'updateCharacter'; payload: Character }
  | { type: 'deleteCharacter'; payload: string }
  | { type: 'appendMessage'; payload: ChatMessage };

const initialState: State = {
  version: STATE_VERSION,
  characters: defaultCharacters,
  chats: {},
  loading: true
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...action.payload, loading: false };
    case 'setLoading':
      return { ...state, loading: action.payload };
    case 'addCharacter':
      return { ...state, characters: [action.payload, ...state.characters] };
    case 'updateCharacter':
      return {
        ...state,
        characters: state.characters.map((c) => (c.id === action.payload.id ? action.payload : c))
      };
    case 'deleteCharacter':
      return {
        ...state,
        characters: state.characters.filter((c) => c.id !== action.payload),
        chats: Object.fromEntries(Object.entries(state.chats).filter(([id]) => id !== action.payload))
      };
    case 'appendMessage': {
      const current = state.chats[action.payload.characterId] ?? [];
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload.characterId]: [...current, action.payload]
        }
      };
    }
    default:
      return state;
  }
}

type ContextValue = {
  state: State;
  createCharacter: (input: CharacterInput) => void;
  updateCharacter: (id: string, input: CharacterInput) => void;
  deleteCharacter: (id: string) => void;
  sendMessage: (character: Character, text: string) => Promise<void>;
};

const AppStoreContext = createContext<ContextValue | undefined>(undefined);

export function AppStoreProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          dispatch({ type: 'setLoading', payload: false });
          return;
        }

        const parsed = JSON.parse(raw) as PersistedState;
        if (parsed.version !== STATE_VERSION) {
          dispatch({ type: 'setLoading', payload: false });
          return;
        }

        dispatch({ type: 'hydrate', payload: parsed });
      } catch {
        dispatch({ type: 'setLoading', payload: false });
      }
    })();
  }, []);

  useEffect(() => {
    if (state.loading) return;
    const persist: PersistedState = {
      version: STATE_VERSION,
      characters: state.characters,
      chats: state.chats
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
  }, [state.characters, state.chats, state.loading]);

  const value = useMemo<ContextValue>(() => ({
    state,
    createCharacter: (input) => {
      const character: Character = {
        id: uuidv4(),
        builtIn: false,
        ...input,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'addCharacter', payload: character });
    },
    updateCharacter: (id, input) => {
      const existing = state.characters.find((c) => c.id === id);
      if (!existing) return;
      dispatch({
        type: 'updateCharacter',
        payload: {
          ...existing,
          ...input
        }
      });
    },
    deleteCharacter: (id) => {
      const target = state.characters.find((c) => c.id === id);
      if (!target || target.builtIn) return;
      dispatch({ type: 'deleteCharacter', payload: id });
    },
    sendMessage: async (character, text) => {
      const checked = messageSchema.safeParse({ text });
      if (!checked.success) return;

      const userMessage: ChatMessage = {
        id: uuidv4(),
        characterId: character.id,
        role: 'user',
        text: checked.data.text,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'appendMessage', payload: userMessage });

      const history = [...(state.chats[character.id] ?? []), userMessage];
      const assistantText = await generateCompanionReply(character, history);
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        characterId: character.id,
        role: 'assistant',
        text: assistantText,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'appendMessage', payload: assistantMessage });
    }
  }), [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): ContextValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }
  return ctx;
}
