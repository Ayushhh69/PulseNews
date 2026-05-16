/**
 * NotificationBanner - Simulated push notification for breaking news.
 * Shows an animated banner that slides down from the top.
 */
import React, { useEffect, useRef, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface NotificationBannerProps {
  visible: boolean;
  title: string;
  message: string;
  onPress?: () => void;
  onDismiss: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  visible,
  title,
  message,
  onPress,
  onDismiss,
}) => {
  const { colors } = useTheme();
  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        dismiss();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(-120);
    }
  }, [visible]);

  const dismiss = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
          transform: [{ translateY }],
        },
      ]}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => {
          onPress?.();
          dismiss();
        }}
        activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>
        <TouchableOpacity onPress={dismiss} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  closeIcon: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default memo(NotificationBanner);
