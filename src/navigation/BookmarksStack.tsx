/**
 * Bookmarks Stack Navigator
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookmarksScreen from '../screens/BookmarksScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import type { BookmarksStackParamList } from './types';

const Stack = createNativeStackNavigator<BookmarksStackParamList>();

const BookmarksStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="BookmarksList" component={BookmarksScreen} />
    <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
  </Stack.Navigator>
);

export default BookmarksStack;
