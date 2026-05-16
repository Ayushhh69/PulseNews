/**
 * Axios client instance with timeout, retry logic, and error normalization.
 */
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '../constants/config';
import type { ApiError } from '../types/api';

/**
 * Create a pre-configured Axios instance.
 */
function createApiClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for logging in dev
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (__DEV__) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  // Response interceptor for error normalization
  client.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      const apiError = normalizeError(error);
      return Promise.reject(apiError);
    },
  );

  return client;
}

/**
 * Normalize Axios errors into a consistent ApiError shape.
 */
function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as Record<string, string> | undefined;
    return {
      message: data?.message || `Server error: ${error.response.status}`,
      code: error.response.status.toString(),
      source: 'network',
    };
  } else if (error.request) {
    // Request made but no response (network error)
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
      source: 'network',
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred.',
      code: 'UNKNOWN',
      source: 'network',
    };
  }
}

/**
 * Execute a function with retry logic.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = API_CONFIG.MAX_RETRIES,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s...
        await new Promise<void>(resolve =>
          setTimeout(() => resolve(), Math.pow(2, attempt) * 1000),
        );
      }
    }
  }
  throw lastError;
}

/** Pre-configured client for NewsAPI */
export const newsApiClient = createApiClient(API_CONFIG.NEWS_API.BASE_URL);

/** Pre-configured client for GNews */
export const gnewsClient = createApiClient(API_CONFIG.GNEWS.BASE_URL);
