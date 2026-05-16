/**
 * News categories supported by both NewsAPI and GNews.
 */

export interface Category {
  id: string;
  label: string;
  icon: string; // Emoji icon for display
}

export const CATEGORIES: Category[] = [
  { id: 'general', label: 'General', icon: '🌍' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
];

export const DEFAULT_CATEGORY = 'general';
