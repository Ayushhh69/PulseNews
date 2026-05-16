/**
 * Core Article interface used throughout the application.
 * Normalized from both NewsAPI and GNews API responses.
 */
export interface Article {
  /** Unique identifier - generated hash from URL */
  id: string;
  /** Article headline */
  title: string;
  /** Short summary/description */
  description: string;
  /** Full article content (may be truncated by APIs) */
  content: string;
  /** Original article URL */
  url: string;
  /** Hero/thumbnail image URL */
  imageUrl: string | null;
  /** Source/publisher name */
  source: string;
  /** Author name */
  author: string | null;
  /** ISO 8601 date string */
  publishedAt: string;
  /** News category */
  category: string;
  /** Which API provided this article */
  apiSource: 'newsapi' | 'gnews';
}

/**
 * Bookmark extends Article with metadata about when it was saved.
 */
export interface BookmarkedArticle extends Article {
  /** Timestamp when the article was bookmarked */
  bookmarkedAt: string;
}
