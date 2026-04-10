export type CharacterTone = 'friendly' | 'mentor' | 'playful' | 'romantic' | 'professional';

export interface Character {
  id: string;
  builtIn: boolean;
  name: string;
  tagline: string;
  backstory: string;
  tone: CharacterTone;
  interests: string[];
  avatar: string;
  createdAt: string;
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  characterId: string;
  role: ChatRole;
  text: string;
  createdAt: string;
}

export interface PersistedState {
  version: number;
  characters: Character[];
  chats: Record<string, ChatMessage[]>;
}
