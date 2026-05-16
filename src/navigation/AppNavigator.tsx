/**
 * AppNavigator - Root navigator with bottom tabs.
 */
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import SearchStack from './SearchStack';
import BookmarksStack from './BookmarksStack';
import { useTheme } from '../hooks/useTheme';
import { useAppSelector } from '../hooks/useAppSelector';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const AppNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const bookmarkCount = useAppSelector(s => s.bookmarks.savedArticles.length);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            elevation: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 20 }}>{focused ? '🏠' : '🏡'}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 20 }}>{focused ? '🔍' : '🔎'}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="BookmarksTab"
          component={BookmarksStack}
          options={{
            tabBarLabel: 'Saved',
            tabBarIcon: ({ focused }) => (
              <View>
                <Text style={{ fontSize: 20 }}>{focused ? '🔖' : '📑'}</Text>
                {bookmarkCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>
                      {bookmarkCount > 9 ? '9+' : bookmarkCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute', top: -4, right: -10,
    minWidth: 18, height: 18, borderRadius: 9,
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
});

export default AppNavigator;
