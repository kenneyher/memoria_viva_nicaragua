import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ResponsiveNavigation from './components/ResponsiveNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <ResponsiveNavigation />
    </NavigationContainer>
  );
}
