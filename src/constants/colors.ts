/**
 * Color palette for light and dark themes.
 * Clean, modern design with a vibrant accent color.
 */

export interface ThemeColors {
  /** Main background */
  background: string;
  /** Card/surface background */
  surface: string;
  /** Elevated surface (e.g. modals) */
  surfaceElevated: string;
  /** Primary text */
  text: string;
  /** Secondary/muted text */
  textSecondary: string;
  /** Tertiary/hint text */
  textTertiary: string;
  /** Primary accent color */
  primary: string;
  /** Lighter variant of primary */
  primaryLight: string;
  /** Primary text on colored backgrounds */
  primaryText: string;
  /** Border/divider color */
  border: string;
  /** Error/destructive color */
  error: string;
  /** Success color */
  success: string;
  /** Warning color */
  warning: string;
  /** Active tab/category pill background */
  activePill: string;
  /** Active tab/category pill text */
  activePillText: string;
  /** Inactive tab/category pill background */
  inactivePill: string;
  /** Inactive tab/category pill text */
  inactivePillText: string;
  /** Skeleton loading placeholder */
  skeleton: string;
  /** Shimmer animation highlight */
  shimmer: string;
  /** Read article overlay */
  readOverlay: string;
  /** Status bar style */
  statusBar: 'light-content' | 'dark-content';
  /** Tab bar background */
  tabBar: string;
  /** Tab bar border */
  tabBarBorder: string;
  /** Search input background */
  searchBackground: string;
  /** Bookmark icon color (active) */
  bookmarkActive: string;
  /** Shadow color */
  shadow: string;
}

export const LightTheme: ThemeColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#1A1D26',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  primary: '#6366F1',
  primaryLight: '#EEF2FF',
  primaryText: '#FFFFFF',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  activePill: '#6366F1',
  activePillText: '#FFFFFF',
  inactivePill: '#F3F4F6',
  inactivePillText: '#6B7280',
  skeleton: '#E5E7EB',
  shimmer: '#F3F4F6',
  readOverlay: 'rgba(0, 0, 0, 0.04)',
  statusBar: 'dark-content',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  searchBackground: '#F3F4F6',
  bookmarkActive: '#6366F1',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const DarkTheme: ThemeColors = {
  background: '#0F1117',
  surface: '#1A1D28',
  surfaceElevated: '#242735',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  primary: '#818CF8',
  primaryLight: '#1E1B4B',
  primaryText: '#FFFFFF',
  border: '#2D3142',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  activePill: '#818CF8',
  activePillText: '#FFFFFF',
  inactivePill: '#1F2233',
  inactivePillText: '#9CA3AF',
  skeleton: '#2D3142',
  shimmer: '#3B3F54',
  readOverlay: 'rgba(255, 255, 255, 0.03)',
  statusBar: 'light-content',
  tabBar: '#1A1D28',
  tabBarBorder: '#2D3142',
  searchBackground: '#1F2233',
  bookmarkActive: '#818CF8',
  shadow: 'rgba(0, 0, 0, 0.3)',
};
