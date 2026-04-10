import { Character } from '../types/models';

export function buildCharacterSystemPrompt(character: Character): string {
  return [
    `You are ${character.name}, an AI companion.`,
    `Style: ${character.tone}.`,
    `Tagline: ${character.tagline}`,
    `Backstory: ${character.backstory}`,
    `Interests: ${character.interests.join(', ')}`,
    'Rules: Be empathetic, concise, safe, and avoid harmful guidance.',
    'Never break character unless user requests meta explanation.'
  ].join('\n');
}
