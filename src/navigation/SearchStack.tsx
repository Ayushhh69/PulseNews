/**
 * Search Stack Navigator
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import type { SearchStackParamList } from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="SearchMain" component={SearchScreen} />
    <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
  </Stack.Navigator>
);

export default SearchStack;
