import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AppStoreProvider } from './src/store/AppStore';

export default function App(): JSX.Element {
  return (
    <AppStoreProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AppStoreProvider>
  );
}
