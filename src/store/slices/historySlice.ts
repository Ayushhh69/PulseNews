/**
 * History slice - read history and recently viewed articles.
 * PERSISTED via redux-persist.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '../../types/article';
import { APP_CONFIG } from '../../constants/config';

interface HistoryState {
  /** IDs of articles the user has opened (for "read" indicator) */
  readArticleIds: string[];
  /** Recently viewed articles with full data (cached) */
  recentlyViewed: Article[];
}

const initialState: HistoryState = {
  readArticleIds: [],
  recentlyViewed: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    markAsRead(state, action: PayloadAction<string>) {
      const articleId = action.payload;
      if (!state.readArticleIds.includes(articleId)) {
        state.readArticleIds.push(articleId);
      }
    },
    addToRecentlyViewed(state, action: PayloadAction<Article>) {
      const article = action.payload;
      // Remove if already in the list
      state.recentlyViewed = state.recentlyViewed.filter(
        a => a.id !== article.id,
      );
      // Add to front
      state.recentlyViewed.unshift(article);
      // Trim to max size
      if (state.recentlyViewed.length > APP_CONFIG.MAX_RECENT_VIEWED) {
        state.recentlyViewed = state.recentlyViewed.slice(
          0,
          APP_CONFIG.MAX_RECENT_VIEWED,
        );
      }
    },
    clearHistory(state) {
      state.readArticleIds = [];
      state.recentlyViewed = [];
    },
  },
});

export const { markAsRead, addToRecentlyViewed, clearHistory } =
  historySlice.actions;

// ─── Selectors ─────────────────────────────────────────────────

export const selectIsRead = (
  state: { history: HistoryState },
  articleId: string,
): boolean => state.history.readArticleIds.includes(articleId);

export const selectRecentlyViewed = (state: { history: HistoryState }) =>
  state.history.recentlyViewed;

export default historySlice.reducer;
