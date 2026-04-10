import { characterFormSchema, messageSchema } from '../src/utils/validation';

describe('validation schemas', () => {
  it('accepts a valid character form', () => {
    const result = characterFormSchema.safeParse({
      name: 'Astra',
      tagline: 'Warm conversation partner for daily chats',
      backstory: 'Astra was designed to help users think clearly and stay motivated every day.',
      tone: 'friendly',
      interests: ['music', 'books'],
      avatar: '🌟'
    });

    expect(result.success).toBe(true);
  });

  it('rejects blank messages', () => {
    const result = messageSchema.safeParse({ text: '   ' });
    expect(result.success).toBe(false);
  });
});
