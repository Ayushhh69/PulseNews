/**
 * GNews.io service layer.
 * Endpoints: /api/v4/top-headlines, /api/v4/search
 */
import { gnewsClient, withRetry } from './apiClient';
import { API_CONFIG } from '../constants/config';
import type { Article } from '../types/article';
import type { GNewsResponse } from '../types/api';
import { generateArticleId } from '../utils/deduplication';

const API_KEY = API_CONFIG.GNEWS.API_KEY;

/**
 * Map category to GNews-compatible topic.
 */
function mapCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    general: 'general',
    business: 'business',
    technology: 'technology',
    science: 'science',
    health: 'health',
    sports: 'sports',
    entertainment: 'entertainment',
  };
  return categoryMap[category] || 'general';
}

/**
 * Transform a GNews article into our normalized Article format.
 */
function transformArticle(
  raw: GNewsResponse['articles'][0],
  category: string,
): Article {
  return {
    id: generateArticleId(raw.url),
    title: raw.title || 'Untitled',
    description: raw.description || '',
    content: raw.content || raw.description || '',
    url: raw.url,
    imageUrl: raw.image || null,
    source: raw.source?.name || 'Unknown',
    author: null, // GNews doesn't provide author
    publishedAt: raw.publishedAt,
    category,
    apiSource: 'gnews',
  };
}

/**
 * Fetch top headlines by category.
 * GNews uses `max` instead of `pageSize` and doesn't support pagination directly.
 * We simulate pagination by using the `from` and `to` date params.
 */
export async function getTopHeadlines(
  category: string = 'general',
  page: number = 1,
  max: number = API_CONFIG.PAGE_SIZE,
): Promise<{ articles: Article[]; totalResults: number }> {
  return withRetry(async () => {
    const response = await gnewsClient.get<GNewsResponse>('/top-headlines', {
      params: {
        topic: mapCategory(category),
        lang: 'en',
        max,
        apikey: API_KEY,
        // GNews free tier limited to 10 articles per request
        // We handle "pagination" at the aggregator level
      },
    });

    const articles = (response.data.articles || []).map(a =>
      transformArticle(a, category),
    );

    return {
      articles,
      totalResults: response.data.totalArticles || 0,
    };
  });
}

/**
 * Search articles by query.
 */
export async function searchArticles(
  query: string,
  page: number = 1,
  max: number = API_CONFIG.PAGE_SIZE,
): Promise<{ articles: Article[]; totalResults: number }> {
  return withRetry(async () => {
    const response = await gnewsClient.get<GNewsResponse>('/search', {
      params: {
        q: query,
        lang: 'en',
        max,
        apikey: API_KEY,
      },
    });

    const articles = (response.data.articles || []).map(a =>
      transformArticle(a, 'search'),
    );

    return {
      articles,
      totalResults: response.data.totalArticles || 0,
    };
  });
}
