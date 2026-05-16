/**
 * API response types for NewsAPI.org and GNews.io
 */

// ─── NewsAPI Types ───────────────────────────────────────────────

export interface NewsApiSource {
  id: string | null;
  name: string;
}

export interface NewsApiArticle {
  source: NewsApiSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

// ─── GNews Types ─────────────────────────────────────────────────

export interface GNewsSource {
  name: string;
  url: string;
}

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: GNewsSource;
}

export interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

// ─── Common Types ────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface FetchArticlesParams extends PaginationParams {
  category: string;
}

export interface SearchArticlesParams extends PaginationParams {
  query: string;
}

export interface ApiError {
  message: string;
  code: string;
  source: 'newsapi' | 'gnews' | 'network';
}
