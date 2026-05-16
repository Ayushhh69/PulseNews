/**
 * Home Stack Navigator
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="HomeFeed" component={HomeScreen} />
    <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
  </Stack.Navigator>
);

export default HomeStack;
