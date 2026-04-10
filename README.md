# AI Companion Mobile App Prototype

A production-style React Native (Expo + TypeScript) prototype for an **AI Companion** app with:

- Built-in companion characters
- Create/edit/delete custom characters
- Character persona controls (tone, interests, backstory, avatar)
- Persistent storage with AsyncStorage
- Chat experience with local history and AI responses
- Pluggable AI provider service (OpenAI-compatible)
- Basic testing setup with Jest + React Native Testing Library

## Tech stack

- Expo (React Native)
- TypeScript
- React Navigation
- AsyncStorage
- Zod for validation
- Jest + @testing-library/react-native

## Quick start

```bash
npm install
npm run start
```

### iOS/Android

```bash
npm run ios
npm run android
```

### Tests

```bash
npm run test
```

## Environment configuration

Copy `.env.example` to `.env` and provide API values if you want real AI responses:

```bash
EXPO_PUBLIC_AI_PROVIDER=openai
EXPO_PUBLIC_OPENAI_API_KEY=your_key
EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini
```

If no key is configured, the app uses a local fallback responder so the prototype is still fully usable.

## Features overview

### 1. Built-in characters

Seeded in `src/data/defaultCharacters.ts`.

### 2. Character Studio

Create your own character with:

- Name
- Tagline
- Backstory
- Tone style
- Interests (comma separated)
- Avatar emoji

### 3. Chat

- Dedicated conversation thread per character
- System prompt generated from character profile
- New message validation and error states
- Loading state while AI responds

### 4. Persistence

- Characters and chats persist locally using AsyncStorage
- Data model version field for easy migrations

## Production-readiness notes

This is a strong prototype foundation with production-oriented structure, but before store deployment you should add:

- Secure key handling / backend token proxy
- User authentication and cloud sync
- Telemetry/analytics
- E2E testing (Detox)
- Offline queue sync conflict handling
- Content moderation and safety filters

