/**
 * Date formatting utilities using date-fns.
 */
import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format a date string into a human-readable relative time.
 * Examples: "2 hours ago", "Yesterday", "May 14, 2025"
 */
export function formatArticleDate(dateString: string): string {
  try {
    const date = parseISO(dateString);

    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    if (isYesterday(date)) {
      return 'Yesterday';
    }

    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Unknown date';
  }
}

/**
 * Format a date for the article detail screen.
 * Example: "May 14, 2025 at 3:45 PM"
 */
export function formatDetailDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  } catch {
    return 'Unknown date';
  }
}
