/**
 * News Aggregator - Combines results from NewsAPI and GNews.
 *
 * Strategy:
 * - Fetches from both APIs in parallel
 * - If one fails, returns results from the other
 * - Deduplicates articles by URL and title similarity
 * - Prioritizes articles with images
 */
import * as NewsApiService from './newsApiService';
import * as GNewsService from './gnewsService';
import type { Article } from '../types/article';
import { deduplicateArticles } from '../utils/deduplication';

interface AggregatedResult {
  articles: Article[];
  totalResults: number;
  /** Which APIs successfully responded */
  sources: ('newsapi' | 'gnews')[];
}

/**
 * Fetch top headlines from both APIs, merge and deduplicate.
 */
export async function getTopHeadlines(
  category: string = 'general',
  page: number = 1,
  pageSize: number = 10,
): Promise<AggregatedResult> {
  const sources: AggregatedResult['sources'] = [];
  const allArticles: Article[] = [];
  let totalResults = 0;

  // Fetch from both APIs in parallel
  const [newsApiResult, gnewsResult] = await Promise.allSettled([
    NewsApiService.getTopHeadlines(category, page, pageSize),
    GNewsService.getTopHeadlines(category, page, pageSize),
  ]);

  // Process NewsAPI results
  if (newsApiResult.status === 'fulfilled') {
    allArticles.push(...newsApiResult.value.articles);
    totalResults += newsApiResult.value.totalResults;
    sources.push('newsapi');
  } else if (__DEV__) {
    console.warn('[Aggregator] NewsAPI failed:', newsApiResult.reason);
  }

  // Process GNews results
  if (gnewsResult.status === 'fulfilled') {
    allArticles.push(...gnewsResult.value.articles);
    totalResults += gnewsResult.value.totalResults;
    sources.push('gnews');
  } else if (__DEV__) {
    console.warn('[Aggregator] GNews failed:', gnewsResult.reason);
  }

  // If both failed, throw an error
  if (sources.length === 0) {
    throw new Error(
      'Unable to fetch news. Please check your internet connection and API keys.',
    );
  }

  // Deduplicate and sort by date (newest first)
  const deduplicated = deduplicateArticles(allArticles) as Article[];
  deduplicated.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return {
    articles: deduplicated,
    totalResults,
    sources,
  };
}

/**
 * Search articles across both APIs.
 */
export async function searchArticles(
  query: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<AggregatedResult> {
  const sources: AggregatedResult['sources'] = [];
  const allArticles: Article[] = [];
  let totalResults = 0;

  const [newsApiResult, gnewsResult] = await Promise.allSettled([
    NewsApiService.searchArticles(query, page, pageSize),
    GNewsService.searchArticles(query, page, pageSize),
  ]);

  if (newsApiResult.status === 'fulfilled') {
    allArticles.push(...newsApiResult.value.articles);
    totalResults += newsApiResult.value.totalResults;
    sources.push('newsapi');
  } else if (__DEV__) {
    console.warn('[Aggregator] NewsAPI search failed:', newsApiResult.reason);
  }

  if (gnewsResult.status === 'fulfilled') {
    allArticles.push(...gnewsResult.value.articles);
    totalResults += gnewsResult.value.totalResults;
    sources.push('gnews');
  } else if (__DEV__) {
    console.warn('[Aggregator] GNews search failed:', gnewsResult.reason);
  }

  if (sources.length === 0) {
    throw new Error(
      'Search failed. Please check your connection and try again.',
    );
  }

  const deduplicated = deduplicateArticles(allArticles) as Article[];
  deduplicated.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return {
    articles: deduplicated,
    totalResults,
    sources,
  };
}
