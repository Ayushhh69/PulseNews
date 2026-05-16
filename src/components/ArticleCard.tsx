/**
 * ArticleCard - Renders a news article preview card.
 *
 * Performance: Wrapped in React.memo to prevent unnecessary re-renders
 * in FlatList. Only re-renders when article data or read status changes.
 */
import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { Article } from '../types/article';
import { formatArticleDate } from '../utils/dateFormatter';
import { useTheme } from '../hooks/useTheme';
import { useAppSelector } from '../hooks/useAppSelector';

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
  onBookmarkPress?: (article: Article) => void;
  isBookmarked?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;
const IMAGE_HEIGHT = 200;

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onPress,
  onBookmarkPress,
  isBookmarked = false,
}) => {
  const { colors, isDark } = useTheme();
  const isRead = useAppSelector(state =>
    state.history.readArticleIds.includes(article.id),
  );

  const handlePress = useCallback(() => {
    onPress(article);
  }, [article, onPress]);

  const handleBookmarkPress = useCallback(() => {
    onBookmarkPress?.(article);
  }, [article, onBookmarkPress]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
        isRead && { opacity: 0.75 },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}>
      {/* Hero Image */}
      {article.imageUrl ? (
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[styles.imagePlaceholder, { backgroundColor: colors.skeleton }]}>
          <Text style={[styles.placeholderEmoji]}>📰</Text>
        </View>
      )}

      {/* Read Indicator */}
      {isRead && (
        <View
          style={[
            styles.readBadge,
            { backgroundColor: colors.primary },
          ]}>
          <Text style={styles.readBadgeText}>Read</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Source & Date Row */}
        <View style={styles.metaRow}>
          <Text
            style={[styles.source, { color: colors.primary }]}
            numberOfLines={1}>
            {article.source}
          </Text>
          <Text style={[styles.date, { color: colors.textTertiary }]}>
            {formatArticleDate(article.publishedAt)}
          </Text>
        </View>

        {/* Title */}
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={3}>
          {article.title}
        </Text>

        {/* Description */}
        {article.description ? (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}>
            {article.description}
          </Text>
        ) : null}

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          {article.author ? (
            <Text
              style={[styles.author, { color: colors.textTertiary }]}
              numberOfLines={1}>
              By {article.author}
            </Text>
          ) : (
            <View />
          )}

          {onBookmarkPress && (
            <TouchableOpacity
              onPress={handleBookmarkPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.bookmarkButton}>
              <Text style={styles.bookmarkIcon}>
                {isBookmarked ? '🔖' : '🏷️'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: CARD_MARGIN,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  imagePlaceholder: {
    width: '100%',
    height: IMAGE_HEIGHT * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  readBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  source: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    flex: 1,
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
});

// Memoize to prevent re-renders in FlatList
export default memo(ArticleCard, (prev, next) => {
  return (
    prev.article.id === next.article.id &&
    prev.isBookmarked === next.isBookmarked
  );
});
