import Constants from 'expo-constants';
import { ChatMessage, Character } from '../types/models';
import { buildCharacterSystemPrompt } from '../utils/prompt';

type Provider = 'openai' | 'mock';

function getProvider(): Provider {
  const provider = process.env.EXPO_PUBLIC_AI_PROVIDER as Provider | undefined;
  return provider ?? 'mock';
}

export async function generateCompanionReply(character: Character, history: ChatMessage[]): Promise<string> {
  const provider = getProvider();
  if (provider === 'openai') {
    const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!key) {
      return mockReply(character, history);
    }

    const model = process.env.EXPO_PUBLIC_OPENAI_MODEL ?? 'gpt-4o-mini';
    const system = buildCharacterSystemPrompt(character);

    const messages = [
      { role: 'system', content: system },
      ...history.map((m) => ({ role: m.role, content: m.text }))
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({ model, messages, temperature: 0.8 })
      });

      if (!response.ok) {
        return mockReply(character, history);
      }

      const json = await response.json();
      const text: string | undefined = json?.choices?.[0]?.message?.content;
      if (!text) {
        return mockReply(character, history);
      }

      return text.trim();
    } catch {
      return mockReply(character, history);
    }
  }

  return mockReply(character, history);
}

function mockReply(character: Character, history: ChatMessage[]): string {
  const lastUser = [...history].reverse().find((m) => m.role === 'user')?.text ?? 'that';
  return `${character.avatar} ${character.name}: I hear you about "${lastUser}". Let’s take one small next step together.`;
}

export const appRuntimeVersion = Constants.expoConfig?.version ?? 'dev';
