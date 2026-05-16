/**
 * SearchScreen - Search for articles with debounced input.
 * Shows recent searches when input is empty.
 */
import React, { useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { useDebounce } from '../hooks/useDebounce';
import {
  performSearch,
  setQuery,
  clearSearch,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '../store/slices/searchSlice';
import { addBookmark, removeBookmark } from '../store/slices/bookmarksSlice';
import { APP_CONFIG } from '../constants/config';
import SearchBar from '../components/SearchBar';
import ArticleCard from '../components/ArticleCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';
import type { Article } from '../types/article';
import type { SearchScreenProps } from '../navigation/types';

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const {
    query,
    results,
    page,
    hasMore,
    loading,
    loadingMore,
    error,
    recentSearches,
  } = useAppSelector(state => state.search);
  const bookmarks = useAppSelector(state => state.bookmarks.savedArticles);
  const bookmarkedIds = new Set(bookmarks.map(b => b.id));

  // Debounce the search query
  const debouncedQuery = useDebounce(query, APP_CONFIG.SEARCH_DEBOUNCE_MS);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      dispatch(performSearch({ query: debouncedQuery.trim(), page: 1 }));
      dispatch(addRecentSearch(debouncedQuery.trim()));
    }
  }, [debouncedQuery, dispatch]);

  // ─── Handlers ──────────────────────────────────────────────

  const handleQueryChange = useCallback(
    (text: string) => {
      dispatch(setQuery(text));
      if (text === '') {
        dispatch(clearSearch());
      }
    },
    [dispatch],
  );

  const handleRecentSearchPress = useCallback(
    (searchQuery: string) => {
      dispatch(setQuery(searchQuery));
      dispatch(performSearch({ query: searchQuery, page: 1 }));
    },
    [dispatch],
  );

  const handleArticlePress = useCallback(
    (article: Article) => {
      navigation.navigate('ArticleDetail', { article });
    },
    [navigation],
  );

  const handleBookmarkPress = useCallback(
    (article: Article) => {
      if (bookmarkedIds.has(article.id)) {
        dispatch(removeBookmark(article.id));
      } else {
        dispatch(addBookmark(article));
      }
    },
    [dispatch, bookmarkedIds],
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading && query.trim()) {
      dispatch(performSearch({ query: query.trim(), page: page + 1 }));
    }
  }, [dispatch, loadingMore, hasMore, loading, query, page]);

  // ─── Render Functions ──────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: Article }) => (
      <ArticleCard
        article={item}
        onPress={handleArticlePress}
        onBookmarkPress={handleBookmarkPress}
        isBookmarked={bookmarkedIds.has(item.id)}
      />
    ),
    [handleArticlePress, handleBookmarkPress, bookmarkedIds],
  );

  const keyExtractor = useCallback((item: Article) => `search-${item.id}`, []);

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return <LoadingIndicator variant="spinner" />;
    }
    return null;
  }, [loadingMore]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    if (!query.trim()) return null;
    if (error) {
      return (
        <EmptyState
          icon="⚠️"
          title="Search failed"
          message={error}
          actionLabel="Try Again"
          onAction={() =>
            dispatch(performSearch({ query: query.trim(), page: 1 }))
          }
        />
      );
    }
    if (results.length === 0 && debouncedQuery.trim().length >= 2) {
      return (
        <EmptyState
          icon="🔍"
          title="No results found"
          message={`We couldn't find any articles matching "${query}"`}
        />
      );
    }
    return null;
  }, [loading, query, error, results.length, debouncedQuery, dispatch]);

  // ─── Recent Searches Section ───────────────────────────────

  const renderRecentSearches = () => {
    if (query.trim() || recentSearches.length === 0) return null;

    return (
      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Text style={[styles.recentTitle, { color: colors.text }]}>
            Recent Searches
          </Text>
          <TouchableOpacity onPress={() => dispatch(clearRecentSearches())}>
            <Text style={[styles.clearText, { color: colors.primary }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
        {recentSearches.map((search, index) => (
          <TouchableOpacity
            key={`recent-${index}`}
            style={[
              styles.recentItem,
              { borderBottomColor: colors.border },
            ]}
            onPress={() => handleRecentSearchPress(search)}>
            <Text style={styles.recentIcon}>🕐</Text>
            <Text
              style={[styles.recentText, { color: colors.textSecondary }]}
              numberOfLines={1}>
              {search}
            </Text>
            <TouchableOpacity
              onPress={() => dispatch(removeRecentSearch(search))}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text
                style={[styles.removeIcon, { color: colors.textTertiary }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ─── Main Render ───────────────────────────────────────────

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Search
        </Text>
      </View>

      {/* Search Bar */}
      <View style={{ backgroundColor: colors.surface }}>
        <SearchBar
          value={query}
          onChangeText={handleQueryChange}
          autoFocus={false}
          placeholder="Search articles, topics, sources..."
        />
      </View>

      {/* Results or Recent Searches */}
      {query.trim() ? (
        loading && results.length === 0 ? (
          <LoadingIndicator variant="skeleton" count={3} />
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )
      ) : (
        renderRecentSearches()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingBottom: 20,
  },
  recentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 8,
  },
  recentTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  recentIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  recentText: {
    flex: 1,
    fontSize: 15,
  },
  removeIcon: {
    fontSize: 14,
    fontWeight: '600',
    padding: 4,
  },
});

export default SearchScreen;
