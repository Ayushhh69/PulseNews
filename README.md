# PulseNews — Smart News Aggregator

A production-grade React Native CLI news aggregator app built with TypeScript, Redux Toolkit, and no third-party UI libraries. Fetches articles from multiple APIs (NewsAPI + GNews), supports offline bookmarks, infinite scrolling, dark mode, and read history.

## Features

### Core
- **Home Feed** — Browse top headlines with category filters (General, Business, Tech, Science, Health, Sports, Entertainment)
- **Infinite Scrolling** — Load more articles as you scroll with optimized FlatList
- **Pull-to-Refresh** — Swipe down to fetch latest news
- **Search** — Debounced search across both APIs with recent search history
- **Article Detail** — Full article view with bookmark, share, and open in browser
- **Offline Bookmarks** — Save articles for offline reading with redux-persist

### Bonus
- **Dark Mode** — System detection + manual toggle (light/dark/system)
- **Read History** — Visual indicator for previously read articles
- **Recently Viewed Cache** — Last 20 viewed articles cached
- **Push Notification Simulation** — In-app breaking news banner
- **Resume Position** — Restores category and scroll position on restart

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native CLI (no Expo) |
| Language | TypeScript |
| State Management | Redux Toolkit + redux-persist |
| Storage | AsyncStorage |
| Networking | Axios |
| Navigation | React Navigation (Native Stack + Bottom Tabs) |
| UI | Core React Native components only |

## Architecture

```
src/
├── api/              # API service layer (NewsAPI, GNews, Aggregator)
├── components/       # Reusable UI components (ArticleCard, CategoryFilter, etc.)
├── constants/        # Config, colors, categories
├── hooks/            # Custom hooks (useDebounce, useTheme, typed Redux hooks)
├── navigation/       # React Navigation setup (Stacks + Tabs)
├── screens/          # Screen components (Home, Search, Bookmarks, ArticleDetail)
├── store/            # Redux store, slices, root reducer
├── types/            # TypeScript interfaces
└── utils/            # Utilities (deduplication, date formatting, storage)
```

## Key Technical Decisions

### 1. Dual API Aggregation
Both NewsAPI and GNews are fetched in parallel via `Promise.allSettled`. If one fails, the app gracefully degrades to show results from the other. Articles are deduplicated by URL and title similarity.

### 2. Selective Persistence
Only `bookmarks`, `settings`, and `history` slices are persisted. Feed data (`news`, `search` results) are fetched fresh on launch to ensure up-to-date content.

### 3. FlatList Performance
- `React.memo` with custom comparator on `ArticleCard`
- `useCallback` for all FlatList handlers
- `removeClippedSubviews`, `maxToRenderPerBatch(10)`, `windowSize(5)`
- `onScrollToIndexFailed` graceful fallback

### 4. Debounced Search
Search input is debounced (300ms) to prevent excessive API calls. Results use the same infinite scroll pattern as the home feed.

### 5. App Lifecycle
`AppState` listener handles foreground/background transitions. State is automatically persisted by redux-persist on background.

## Setup & Run

### Prerequisites
- Node.js 18+
- JDK 17
- Android Studio with SDK
- `ANDROID_HOME` and `JAVA_HOME` environment variables

### Install
```bash
cd PulseNews
npm install
```

### Configure API Keys
Edit `src/constants/config.ts` and replace:
```typescript
API_KEY: 'YOUR_NEWSAPI_KEY_HERE',  // Get from https://newsapi.org
API_KEY: 'YOUR_GNEWS_KEY_HERE',    // Get from https://gnews.io
```

### Run
```bash
npx react-native run-android
```

## Improvements With More Time

1. **WebView Article Reader** — In-app article reading instead of opening browser
2. **Image Caching** — Use react-native-fast-image for efficient image loading
3. **Unit Tests** — Jest + React Testing Library for component and Redux tests
4. **E2E Tests** — Detox for end-to-end testing
5. **Error Boundary** — React error boundaries for graceful crash recovery
6. **Analytics** — Track user engagement patterns
7. **Background Fetch** — True background notifications with Headless JS
8. **Localization** — Multi-language support with i18n
