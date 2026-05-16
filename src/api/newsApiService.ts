/**
 * NewsAPI.org service layer.
 * Endpoints: /v2/top-headlines, /v2/everything
 */
import { newsApiClient, withRetry } from './apiClient';
import { API_CONFIG } from '../constants/config';
import type { Article } from '../types/article';
import type { NewsApiResponse } from '../types/api';
import { generateArticleId } from '../utils/deduplication';

const API_KEY = API_CONFIG.NEWS_API.API_KEY;

/**
 * Map category names to NewsAPI-compatible values.
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
 * Transform a NewsAPI article into our normalized Article format.
 */
function transformArticle(
  raw: NewsApiResponse['articles'][0],
  category: string,
): Article {
  return {
    id: generateArticleId(raw.url),
    title: raw.title || 'Untitled',
    description: raw.description || '',
    content: raw.content || raw.description || '',
    url: raw.url,
    imageUrl: raw.urlToImage || null,
    source: raw.source?.name || 'Unknown',
    author: raw.author || null,
    publishedAt: raw.publishedAt,
    category,
    apiSource: 'newsapi',
  };
}

/**
 * Fetch top headlines by category.
 */
export async function getTopHeadlines(
  category: string = 'general',
  page: number = 1,
  pageSize: number = API_CONFIG.PAGE_SIZE,
): Promise<{ articles: Article[]; totalResults: number }> {
  return withRetry(async () => {
    const response = await newsApiClient.get<NewsApiResponse>(
      '/top-headlines',
      {
        params: {
          category: mapCategory(category),
          country: 'us',
          page,
          pageSize,
          apiKey: API_KEY,
        },
      },
    );

    const articles = (response.data.articles || [])
      .filter(a => a.title && a.title !== '[Removed]')
      .map(a => transformArticle(a, category));

    return {
      articles,
      totalResults: response.data.totalResults || 0,
    };
  });
}

/**
 * Search articles by query.
 */
export async function searchArticles(
  query: string,
  page: number = 1,
  pageSize: number = API_CONFIG.PAGE_SIZE,
): Promise<{ articles: Article[]; totalResults: number }> {
  return withRetry(async () => {
    const response = await newsApiClient.get<NewsApiResponse>('/everything', {
      params: {
        q: query,
        sortBy: 'publishedAt',
        language: 'en',
        page,
        pageSize,
        apiKey: API_KEY,
      },
    });

    const articles = (response.data.articles || [])
      .filter(a => a.title && a.title !== '[Removed]')
      .map(a => transformArticle(a, 'search'));

    return {
      articles,
      totalResults: response.data.totalResults || 0,
    };
  });
}
