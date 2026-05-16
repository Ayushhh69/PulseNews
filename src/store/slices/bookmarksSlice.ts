/**
 * Bookmarks slice - manages saved articles for offline access.
 * PERSISTED via redux-persist.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Article, BookmarkedArticle } from '../../types/article';

interface BookmarksState {
  /** Saved articles with full data for offline access */
  savedArticles: BookmarkedArticle[];
}

const initialState: BookmarksState = {
  savedArticles: [],
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addBookmark(state, action: PayloadAction<Article>) {
      const article = action.payload;
      // Don't add if already bookmarked
      const exists = state.savedArticles.some(a => a.id === article.id);
      if (!exists) {
        state.savedArticles.unshift({
          ...article,
          bookmarkedAt: new Date().toISOString(),
        });
      }
    },
    removeBookmark(state, action: PayloadAction<string>) {
      state.savedArticles = state.savedArticles.filter(
        a => a.id !== action.payload,
      );
    },
    clearAllBookmarks(state) {
      state.savedArticles = [];
    },
  },
});

export const { addBookmark, removeBookmark, clearAllBookmarks } =
  bookmarksSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────

/** Check if an article is bookmarked */
export const selectIsBookmarked = (
  state: { bookmarks: BookmarksState },
  articleId: string,
): boolean => state.bookmarks.savedArticles.some(a => a.id === articleId);

/** Get all bookmarked articles */
export const selectBookmarks = (state: { bookmarks: BookmarksState }) =>
  state.bookmarks.savedArticles;

/** Get bookmark count */
export const selectBookmarkCount = (state: { bookmarks: BookmarksState }) =>
  state.bookmarks.savedArticles.length;

export default bookmarksSlice.reducer;
