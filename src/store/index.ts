/**
 * Redux store configuration with redux-persist.
 *
 * Persistence strategy:
 * - bookmarks: PERSISTED (offline saved articles)
 * - settings:  PERSISTED (theme, last position)
 * - history:   PERSISTED (read history, recently viewed)
 * - news:      NOT persisted (fresh data on launch)
 * - search:    PARTIALLY persisted (only recentSearches)
 */
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './rootReducer';

const persistConfig = {
  key: 'pulse_root',
  storage: AsyncStorage,
  // Only persist these slices
  whitelist: ['bookmarks', 'settings', 'history', 'search'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions (they contain non-serializable values)
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
