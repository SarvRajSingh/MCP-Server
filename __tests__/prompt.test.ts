import { defaultCharacters } from '../src/data/defaultCharacters';
import { buildCharacterSystemPrompt } from '../src/utils/prompt';

describe('buildCharacterSystemPrompt', () => {
  it('includes persona details', () => {
    const prompt = buildCharacterSystemPrompt(defaultCharacters[0]);
    expect(prompt).toContain('You are Luna');
    expect(prompt).toContain('mindfulness');
    expect(prompt).toContain('Rules:');
  });
});
