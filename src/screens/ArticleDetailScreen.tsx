/**
 * ArticleDetailScreen - Full article view with bookmark, share, and open in browser.
 */
import React, { useEffect, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, Linking, Share,
  StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { addBookmark, removeBookmark } from '../store/slices/bookmarksSlice';
import { markAsRead, addToRecentlyViewed } from '../store/slices/historySlice';
import { formatDetailDate } from '../utils/dateFormatter';
import type { Article } from '../types/article';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  route: { params: { article: Article } };
  navigation: any;
}

const ArticleDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const article = route.params.article;

  const isBookmarked = useAppSelector(state =>
    state.bookmarks.savedArticles.some(a => a.id === article.id),
  );

  // Mark as read and add to recently viewed on mount
  useEffect(() => {
    dispatch(markAsRead(article.id));
    dispatch(addToRecentlyViewed(article));
  }, [dispatch, article]);

  const handleBookmark = useCallback(() => {
    if (isBookmarked) {
      dispatch(removeBookmark(article.id));
    } else {
      dispatch(addBookmark(article));
    }
  }, [dispatch, article, isBookmarked]);

  const handleOpenInBrowser = useCallback(async () => {
    try { await Linking.openURL(article.url); } catch { /* ignore */ }
  }, [article.url]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({ message: `${article.title}\n\n${article.url}`, title: article.title });
    } catch { /* ignore */ }
  }, [article]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Hero Image */}
        {article.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: article.imageUrl }} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.imageOverlay} />
          </View>
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.primary }]}>
            <Text style={styles.placeholderEmoji}>📰</Text>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {/* Source badge */}
          <View style={[styles.sourceBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.sourceText, { color: colors.primary }]}>{article.source}</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            {article.author && (
              <Text style={[styles.author, { color: colors.textSecondary }]}>By {article.author}</Text>
            )}
            <Text style={[styles.date, { color: colors.textTertiary }]}>
              {formatDetailDate(article.publishedAt)}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: isBookmarked ? colors.primary : colors.surface, borderColor: colors.border }]}
              onPress={handleBookmark}>
              <Text style={styles.actionIcon}>{isBookmarked ? '🔖' : '🏷️'}</Text>
              <Text style={[styles.actionText, { color: isBookmarked ? colors.primaryText : colors.text }]}>
                {isBookmarked ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleShare}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={[styles.actionText, { color: colors.text }]}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleOpenInBrowser}>
              <Text style={styles.actionIcon}>🌐</Text>
              <Text style={[styles.actionText, { color: colors.text }]}>Open</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Article Content */}
          <Text style={[styles.articleContent, { color: colors.text }]}>
            {article.content || article.description || 'No content available.'}
          </Text>

          {/* Read Full Article */}
          <TouchableOpacity
            style={[styles.readFullButton, { backgroundColor: colors.primary }]}
            onPress={handleOpenInBrowser}>
            <Text style={[styles.readFullText, { color: colors.primaryText }]}>
              Read Full Article →
            </Text>
          </TouchableOpacity>

          {/* API Source indicator */}
          <Text style={[styles.apiSource, { color: colors.textTertiary }]}>
            Source: {article.apiSource === 'newsapi' ? 'NewsAPI' : 'GNews'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { position: 'relative' },
  heroImage: { width: SCREEN_WIDTH, height: 280 },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  imagePlaceholder: { width: SCREEN_WIDTH, height: 200, justifyContent: 'center', alignItems: 'center' },
  placeholderEmoji: { fontSize: 64 },
  backButton: {
    position: 'absolute', top: 48, left: 16, width: 40, height: 40,
    borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  },
  backIcon: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  content: { padding: 20, marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  sourceBadge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  sourceText: { fontSize: 13, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800', lineHeight: 32, letterSpacing: -0.5, marginBottom: 12 },
  metaRow: { marginBottom: 16 },
  author: { fontSize: 14, marginBottom: 4 },
  date: { fontSize: 13 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 12, borderWidth: 1, gap: 6,
  },
  actionIcon: { fontSize: 16 },
  actionText: { fontSize: 13, fontWeight: '600' },
  divider: { height: 1, marginBottom: 20 },
  articleContent: { fontSize: 16, lineHeight: 26, letterSpacing: 0.2, marginBottom: 24 },
  readFullButton: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 16 },
  readFullText: { fontSize: 16, fontWeight: '700' },
  apiSource: { fontSize: 11, textAlign: 'center', marginBottom: 40 },
});

export default ArticleDetailScreen;
