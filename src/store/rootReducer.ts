/**
 * Root reducer - combines all slices.
 */
import { combineReducers } from '@reduxjs/toolkit';
import newsReducer from './slices/newsSlice';
import bookmarksReducer from './slices/bookmarksSlice';
import searchReducer from './slices/searchSlice';
import settingsReducer from './slices/settingsSlice';
import historyReducer from './slices/historySlice';

const rootReducer = combineReducers({
  news: newsReducer,
  bookmarks: bookmarksReducer,
  search: searchReducer,
  settings: settingsReducer,
  history: historyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
