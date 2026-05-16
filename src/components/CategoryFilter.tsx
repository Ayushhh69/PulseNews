/**
 * CategoryFilter - Horizontal scrollable category pills.
 */
import React, { memo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CATEGORIES, type Category } from '../constants/categories';
import { useTheme } from '../hooks/useTheme';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const renderPill = useCallback(
    (category: Category) => {
      const isActive = category.id === selectedCategory;

      return (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.pill,
            {
              backgroundColor: isActive
                ? colors.activePill
                : colors.inactivePill,
              borderColor: isActive ? colors.activePill : colors.border,
            },
          ]}
          onPress={() => onSelectCategory(category.id)}
          activeOpacity={0.7}>
          <Text style={styles.pillIcon}>{category.icon}</Text>
          <Text
            style={[
              styles.pillText,
              {
                color: isActive
                  ? colors.activePillText
                  : colors.inactivePillText,
                fontWeight: isActive ? '700' : '500',
              },
            ]}>
            {category.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedCategory, colors, onSelectCategory],
  );

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {CATEGORIES.map(renderPill)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  pillIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  pillText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
});

export default memo(CategoryFilter);
