/**
 * SearchBar - Text input with clear button.
 */
import React, { memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search news...',
  autoFocus = false,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.searchBackground,
          borderColor: colors.border,
        },
      ]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearButton}>
          <Text style={[styles.clearIcon, { color: colors.textSecondary }]}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default memo(SearchBar);
