/**
 * Theme hook - resolves the current theme colors based on user preference
 * and system appearance.
 */
import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useAppSelector } from './useAppSelector';
import { LightTheme, DarkTheme, ThemeColors } from '../constants/colors';

interface ThemeResult {
  colors: ThemeColors;
  isDark: boolean;
}

export function useTheme(): ThemeResult {
  const darkModeSetting = useAppSelector(state => state.settings.darkMode);
  const systemScheme = useColorScheme();

  const result = useMemo<ThemeResult>(() => {
    let isDark: boolean;

    if (darkModeSetting === 'system') {
      isDark = systemScheme === 'dark';
    } else {
      isDark = darkModeSetting === 'dark';
    }

    return {
      colors: isDark ? DarkTheme : LightTheme,
      isDark,
    };
  }, [darkModeSetting, systemScheme]);

  return result;
}
