/**
 * BookmarksScreen - Displays saved articles for offline reading.
 */
import React, { useCallback } from 'react';
import {
  View, FlatList, Text, TouchableOpacity, Alert, StyleSheet, StatusBar,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { removeBookmark, clearAllBookmarks, selectBookmarks } from '../store/slices/bookmarksSlice';
import ArticleCard from '../components/ArticleCard';
import EmptyState from '../components/EmptyState';
import type { Article, BookmarkedArticle } from '../types/article';
import type { BookmarksScreenProps } from '../navigation/types';

const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector(selectBookmarks);

  const handleArticlePress = useCallback(
    (article: Article) => { navigation.navigate('ArticleDetail', { article }); },
    [navigation],
  );

  const handleRemoveBookmark = useCallback(
    (article: Article) => {
      Alert.alert('Remove Bookmark', `Remove "${article.title}" from bookmarks?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeBookmark(article.id)) },
      ]);
    },
    [dispatch],
  );

  const handleClearAll = useCallback(() => {
    Alert.alert('Clear All Bookmarks', 'Remove all saved articles?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => dispatch(clearAllBookmarks()) },
    ]);
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: BookmarkedArticle }) => (
      <ArticleCard article={item} onPress={handleArticlePress} onBookmarkPress={handleRemoveBookmark} isBookmarked={true} />
    ),
    [handleArticlePress, handleRemoveBookmark],
  );

  const keyExtractor = useCallback((item: BookmarkedArticle) => `bm-${item.id}`, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Bookmarks</Text>
          {bookmarks.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={[styles.clearText, { color: colors.error }]}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        {bookmarks.length > 0 && (
          <Text style={[styles.countText, { color: colors.textSecondary }]}>
            {bookmarks.length} saved article{bookmarks.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <EmptyState icon="🔖" title="No bookmarks yet" message="Save articles to read them later, even offline." />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  clearText: { fontSize: 14, fontWeight: '600' },
  countText: { fontSize: 13, marginTop: 2 },
  listContent: { paddingBottom: 20, flexGrow: 1 },
});

export default BookmarksScreen;
