/**
 * Settings slice - user preferences.
 * PERSISTED via redux-persist.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DarkModeOption = 'light' | 'dark' | 'system';

interface SettingsState {
  /** Dark mode preference */
  darkMode: DarkModeOption;
  /** Last category the user was viewing */
  lastCategory: string;
  /** Last scroll index in the home feed */
  lastScrollIndex: number;
}

const initialState: SettingsState = {
  darkMode: 'system',
  lastCategory: 'general',
  lastScrollIndex: 0,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkMode(state, action: PayloadAction<DarkModeOption>) {
      state.darkMode = action.payload;
    },
    toggleDarkMode(state) {
      if (state.darkMode === 'light') {
        state.darkMode = 'dark';
      } else if (state.darkMode === 'dark') {
        state.darkMode = 'system';
      } else {
        state.darkMode = 'light';
      }
    },
    saveLastPosition(
      state,
      action: PayloadAction<{ category: string; scrollIndex: number }>,
    ) {
      state.lastCategory = action.payload.category;
      state.lastScrollIndex = action.payload.scrollIndex;
    },
  },
});

export const { setDarkMode, toggleDarkMode, saveLastPosition } =
  settingsSlice.actions;

export default settingsSlice.reducer;
