/**
 * LoadingIndicator - Loading states for lists and screens.
 * Includes skeleton card placeholder for initial loads.
 */
import React, { memo, useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface LoadingIndicatorProps {
  /** Show skeleton cards (for initial load) or spinner (for load more) */
  variant?: 'skeleton' | 'spinner';
  /** Number of skeleton cards to show */
  count?: number;
}

/** Skeleton card placeholder that shimmers */
const SkeletonCard: React.FC = () => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeletonCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity,
        },
      ]}>
      {/* Image placeholder */}
      <View
        style={[styles.skeletonImage, { backgroundColor: colors.skeleton }]}
      />
      {/* Content placeholders */}
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonMetaRow}>
          <View
            style={[
              styles.skeletonSource,
              { backgroundColor: colors.skeleton },
            ]}
          />
          <View
            style={[
              styles.skeletonDate,
              { backgroundColor: colors.skeleton },
            ]}
          />
        </View>
        <View
          style={[
            styles.skeletonTitle,
            { backgroundColor: colors.skeleton },
          ]}
        />
        <View
          style={[
            styles.skeletonTitleShort,
            { backgroundColor: colors.skeleton },
          ]}
        />
        <View
          style={[
            styles.skeletonDescription,
            { backgroundColor: colors.skeleton },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  variant = 'spinner',
  count = 3,
}) => {
  const { colors } = useTheme();

  if (variant === 'skeleton') {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  skeletonContainer: {
    paddingTop: 8,
  },
  skeletonCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  skeletonImage: {
    width: '100%',
    height: 120,
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonSource: {
    width: 80,
    height: 12,
    borderRadius: 6,
  },
  skeletonDate: {
    width: 60,
    height: 12,
    borderRadius: 6,
  },
  skeletonTitle: {
    width: '100%',
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonTitleShort: {
    width: '70%',
    height: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  skeletonDescription: {
    width: '90%',
    height: 12,
    borderRadius: 6,
  },
});

export default memo(LoadingIndicator);
