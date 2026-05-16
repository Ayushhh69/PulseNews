/**
 * News feed slice - manages the home feed articles.
 * Not persisted (fresh data on each app launch).
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '../../types/article';
import * as NewsAggregator from '../../api/newsAggregator';
import { API_CONFIG } from '../../constants/config';
import { DEFAULT_CATEGORY } from '../../constants/categories';

interface NewsState {
  /** Current articles in the feed */
  articles: Article[];
  /** Current page for pagination */
  page: number;
  /** Whether there are more articles to load */
  hasMore: boolean;
  /** Initial loading state */
  loading: boolean;
  /** Loading more articles (infinite scroll) */
  loadingMore: boolean;
  /** Pull-to-refresh loading */
  refreshing: boolean;
  /** Error message if fetch fails */
  error: string | null;
  /** Currently selected category */
  selectedCategory: string;
  /** Which API sources responded */
  activeSources: ('newsapi' | 'gnews')[];
}

const initialState: NewsState = {
  articles: [],
  page: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  refreshing: false,
  error: null,
  selectedCategory: DEFAULT_CATEGORY,
  activeSources: [],
};

/**
 * Fetch articles for the current category and page.
 */
export const fetchArticles = createAsyncThunk(
  'news/fetchArticles',
  async (
    { category, page }: { category: string; page: number },
    { rejectWithValue },
  ) => {
    try {
      const result = await NewsAggregator.getTopHeadlines(
        category,
        page,
        API_CONFIG.PAGE_SIZE,
      );
      return {
        articles: result.articles,
        totalResults: result.totalResults,
        sources: result.sources,
        page,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch articles';
      return rejectWithValue(message);
    }
  },
);

/**
 * Refresh the feed (pull-to-refresh).
 */
export const refreshArticles = createAsyncThunk(
  'news/refreshArticles',
  async (category: string, { rejectWithValue }) => {
    try {
      const result = await NewsAggregator.getTopHeadlines(
        category,
        1,
        API_CONFIG.PAGE_SIZE,
      );
      return {
        articles: result.articles,
        totalResults: result.totalResults,
        sources: result.sources,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to refresh articles';
      return rejectWithValue(message);
    }
  },
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      if (state.selectedCategory !== action.payload) {
        state.selectedCategory = action.payload;
        state.articles = [];
        state.page = 1;
        state.hasMore = true;
        state.error = null;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // ─── Fetch Articles ─────────────────────────────
      .addCase(fetchArticles.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        const { articles, page, sources } = action.payload;

        if (page === 1) {
          state.articles = articles;
        } else {
          // Append new articles, avoiding duplicates
          const existingIds = new Set(state.articles.map(a => a.id));
          const newArticles = articles.filter(a => !existingIds.has(a.id));
          state.articles = [...state.articles, ...newArticles];
        }

        state.page = page;
        state.hasMore = articles.length >= API_CONFIG.PAGE_SIZE;
        state.loading = false;
        state.loadingMore = false;
        state.activeSources = sources;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      // ─── Refresh Articles ──────────────────────────
      .addCase(refreshArticles.pending, state => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshArticles.fulfilled, (state, action) => {
        state.articles = action.payload.articles;
        state.page = 1;
        state.hasMore = true;
        state.refreshing = false;
        state.activeSources = action.payload.sources;
      })
      .addCase(refreshArticles.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCategory, clearError } = newsSlice.actions;
export default newsSlice.reducer;
