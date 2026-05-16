/**
 * HomeScreen - Main news feed with category filter and infinite scroll.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Text,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  fetchArticles,
  refreshArticles,
  setCategory,
} from '../store/slices/newsSlice';
import {
  addBookmark,
  removeBookmark,
} from '../store/slices/bookmarksSlice';
import { saveLastPosition } from '../store/slices/settingsSlice';
import CategoryFilter from '../components/CategoryFilter';
import ArticleCard from '../components/ArticleCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';
import NotificationBanner from '../components/NotificationBanner';
import type { Article } from '../types/article';
import type { HomeScreenProps } from '../navigation/types';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const flatListRef = useRef<FlatList>(null);

  // Redux state
  const {
    articles,
    page,
    hasMore,
    loading,
    loadingMore,
    refreshing,
    error,
    selectedCategory,
  } = useAppSelector(state => state.news);
  const bookmarks = useAppSelector(state => state.bookmarks.savedArticles);
  const lastScrollIndex = useAppSelector(
    state => state.settings.lastScrollIndex,
  );
  const lastCategory = useAppSelector(state => state.settings.lastCategory);

  // Local state for notification simulation
  const [showNotification, setShowNotification] = useState(false);
  const [notificationArticle, setNotificationArticle] =
    useState<Article | null>(null);

  // Bookmarked IDs set for O(1) lookup
  const bookmarkedIds = new Set(bookmarks.map(b => b.id));

  // ─── Initial Load ──────────────────────────────────────────
  useEffect(() => {
    // Restore last category on mount
    if (lastCategory && lastCategory !== selectedCategory) {
      dispatch(setCategory(lastCategory));
    }
  }, []);

  // Fetch articles when category changes
  useEffect(() => {
    if (articles.length === 0 || loading) {
      dispatch(fetchArticles({ category: selectedCategory, page: 1 }));
    }
  }, [selectedCategory]);

  // Restore scroll position after articles load
  useEffect(() => {
    if (
      articles.length > 0 &&
      lastScrollIndex > 0 &&
      lastScrollIndex < articles.length
    ) {
      // Small delay to ensure FlatList is rendered
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: Math.min(lastScrollIndex, articles.length - 1),
          animated: false,
        });
      }, 300);
    }
  }, [articles.length > 0 && lastScrollIndex > 0]);

  // Simulate push notification
  useEffect(() => {
    const timer = setInterval(() => {
      if (articles.length > 3) {
        const randomArticle =
          articles[Math.floor(Math.random() * Math.min(5, articles.length))];
        setNotificationArticle(randomArticle);
        setShowNotification(true);
      }
    }, 60000); // Every 60 seconds

    return () => clearInterval(timer);
  }, [articles]);

  // ─── Handlers ──────────────────────────────────────────────

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      dispatch(setCategory(categoryId));
      dispatch(fetchArticles({ category: categoryId, page: 1 }));
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
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

  const handleRefresh = useCallback(() => {
    dispatch(refreshArticles(selectedCategory));
  }, [dispatch, selectedCategory]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      dispatch(
        fetchArticles({ category: selectedCategory, page: page + 1 }),
      );
    }
  }, [dispatch, loadingMore, hasMore, loading, selectedCategory, page]);

  const handleScrollEnd = useCallback(
    (event: any) => {
      const offset = event.nativeEvent.contentOffset.y;
      const itemHeight = 300; // Approximate card height
      const index = Math.round(offset / itemHeight);
      dispatch(
        saveLastPosition({
          category: selectedCategory,
          scrollIndex: index,
        }),
      );
    },
    [dispatch, selectedCategory],
  );

  // ─── Render Helpers ────────────────────────────────────────

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

  const keyExtractor = useCallback((item: Article) => item.id, []);

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return <LoadingIndicator variant="spinner" />;
    }
    if (!hasMore && articles.length > 0) {
      return (
        <View style={styles.endMessage}>
          <Text style={[styles.endMessageText, { color: colors.textTertiary }]}>
            You're all caught up! 🎉
          </Text>
        </View>
      );
    }
    return null;
  }, [loadingMore, hasMore, articles.length, colors]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    if (error) {
      return (
        <EmptyState
          icon="⚠️"
          title="Something went wrong"
          message={error}
          actionLabel="Try Again"
          onAction={() =>
            dispatch(fetchArticles({ category: selectedCategory, page: 1 }))
          }
        />
      );
    }
    return (
      <EmptyState
        icon="📰"
        title="No articles found"
        message="There are no articles available for this category right now."
        actionLabel="Refresh"
        onAction={handleRefresh}
      />
    );
  }, [loading, error, selectedCategory, dispatch, handleRefresh]);

  const renderHeader = useCallback(
    () => (
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
    ),
    [selectedCategory, handleCategoryChange],
  );

  // ─── Main Render ───────────────────────────────────────────

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Pulse
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.primary }]}>
          News
        </Text>
      </View>

      {loading && articles.length === 0 ? (
        <>
          {renderHeader()}
          <LoadingIndicator variant="skeleton" count={3} />
        </>
      ) : (
        <FlatList
          ref={flatListRef}
          data={articles}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          onMomentumScrollEnd={handleScrollEnd}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.surface}
            />
          }
          // ─── Performance Optimizations ──────────────
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={5}
          updateCellsBatchingPeriod={100}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={info => {
            // Graceful fallback if scroll-to-index fails
            setTimeout(() => {
              flatListRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: false,
              });
            }, 100);
          }}
        />
      )}

      {/* Notification Banner */}
      <NotificationBanner
        visible={showNotification}
        title="Breaking News"
        message={notificationArticle?.title || ''}
        onPress={() => {
          if (notificationArticle) {
            handleArticlePress(notificationArticle);
          }
        }}
        onDismiss={() => setShowNotification(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 28,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: -0.5,
  },
  listContent: {
    paddingBottom: 20,
  },
  endMessage: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  endMessageText: {
    fontSize: 14,
  },
});

export default HomeScreen;
