/**
 * Application configuration constants.
 *
 * IMPORTANT: Replace API keys with your own before running.
 * - NewsAPI: https://newsapi.org/register
 * - GNews:   https://gnews.io/register
 */

export const API_CONFIG = {
  NEWS_API: {
    BASE_URL: 'https://newsapi.org/v2',
    API_KEY: '2fe5d199155743a6819c5f94c90b791b',
  },
  GNEWS: {
    BASE_URL: 'https://gnews.io/api/v4',
    API_KEY: '3aedee7ecb4d54dd23c0883b87577a39',
  },
  /** Request timeout in milliseconds */
  TIMEOUT: 10000,
  /** Number of articles per page */
  PAGE_SIZE: 10,
  /** Max retry attempts on failure */
  MAX_RETRIES: 2,
} as const;

export const APP_CONFIG = {
  /** App name */
  APP_NAME: 'PulseNews',
  /** Max number of recently viewed articles to cache */
  MAX_RECENT_VIEWED: 20,
  /** Max number of recent searches to store */
  MAX_RECENT_SEARCHES: 10,
  /** Debounce delay for search input (ms) */
  SEARCH_DEBOUNCE_MS: 300,
  /** Notification check interval (ms) - 5 minutes */
  NOTIFICATION_INTERVAL: 5 * 60 * 1000,
} as const;
