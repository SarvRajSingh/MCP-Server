import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatScreen } from '../screens/ChatScreen';
import { CharacterStudioScreen } from '../screens/CharacterStudioScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): JSX.Element {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#0f172a',
          card: '#0f172a',
          text: '#ffffff',
          border: '#1e293b',
          primary: '#2563eb'
        }
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Companions' }} />
        <Stack.Screen name="CharacterStudio" component={CharacterStudioScreen} options={{ title: 'Character Studio' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Conversation' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
