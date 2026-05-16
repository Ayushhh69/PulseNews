/**
 * Search slice - manages search state and recent searches.
 * recentSearches is persisted, results are not.
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '../../types/article';
import * as NewsAggregator from '../../api/newsAggregator';
import { API_CONFIG, APP_CONFIG } from '../../constants/config';

interface SearchState {
  /** Current search query */
  query: string;
  /** Search results */
  results: Article[];
  /** Current page for pagination */
  page: number;
  /** Whether there are more results */
  hasMore: boolean;
  /** Loading state */
  loading: boolean;
  /** Loading more results */
  loadingMore: boolean;
  /** Error message */
  error: string | null;
  /** Recent search queries (persisted) */
  recentSearches: string[];
}

const initialState: SearchState = {
  query: '',
  results: [],
  page: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  error: null,
  recentSearches: [],
};

/**
 * Search articles across all APIs.
 */
export const performSearch = createAsyncThunk(
  'search/performSearch',
  async (
    { query, page }: { query: string; page: number },
    { rejectWithValue },
  ) => {
    try {
      const result = await NewsAggregator.searchArticles(
        query,
        page,
        API_CONFIG.PAGE_SIZE,
      );
      return {
        articles: result.articles,
        totalResults: result.totalResults,
        page,
        query,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Search failed';
      return rejectWithValue(message);
    }
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearSearch(state) {
      state.query = '';
      state.results = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
    addRecentSearch(state, action: PayloadAction<string>) {
      const query = action.payload.trim();
      if (!query) return;

      // Remove if already exists, then add to front
      state.recentSearches = state.recentSearches.filter(s => s !== query);
      state.recentSearches.unshift(query);

      // Keep only the most recent
      if (state.recentSearches.length > APP_CONFIG.MAX_RECENT_SEARCHES) {
        state.recentSearches = state.recentSearches.slice(
          0,
          APP_CONFIG.MAX_RECENT_SEARCHES,
        );
      }
    },
    removeRecentSearch(state, action: PayloadAction<string>) {
      state.recentSearches = state.recentSearches.filter(
        s => s !== action.payload,
      );
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(performSearch.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loading = true;
          state.results = [];
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        const { articles, page } = action.payload;

        if (page === 1) {
          state.results = articles;
        } else {
          const existingIds = new Set(state.results.map(a => a.id));
          const newArticles = articles.filter(a => !existingIds.has(a.id));
          state.results = [...state.results, ...newArticles];
        }

        state.page = page;
        state.hasMore = articles.length >= API_CONFIG.PAGE_SIZE;
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setQuery,
  clearSearch,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;
