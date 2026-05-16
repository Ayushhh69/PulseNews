/**
 * AsyncStorage helper utilities for direct storage operations
 * outside of Redux persist.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SCROLL_POSITION: '@pulse_scroll_position',
  LAST_FETCH_TIME: '@pulse_last_fetch',
} as const;

/**
 * Save the last scroll position for a category.
 */
export async function saveScrollPosition(
  category: string,
  index: number,
): Promise<void> {
  try {
    const data = JSON.stringify({ category, index, timestamp: Date.now() });
    await AsyncStorage.setItem(STORAGE_KEYS.SCROLL_POSITION, data);
  } catch (error) {
    console.warn('Failed to save scroll position:', error);
  }
}

/**
 * Retrieve the last scroll position.
 */
export async function getScrollPosition(): Promise<{
  category: string;
  index: number;
} | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SCROLL_POSITION);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.warn('Failed to get scroll position:', error);
    return null;
  }
}

/**
 * Save the timestamp of the last successful API fetch.
 */
export async function saveLastFetchTime(): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_FETCH_TIME,
      Date.now().toString(),
    );
  } catch (error) {
    console.warn('Failed to save last fetch time:', error);
  }
}

/**
 * Get the timestamp of the last successful API fetch.
 */
export async function getLastFetchTime(): Promise<number | null> {
  try {
    const time = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FETCH_TIME);
    return time ? parseInt(time, 10) : null;
  } catch (error) {
    console.warn('Failed to get last fetch time:', error);
    return null;
  }
}
