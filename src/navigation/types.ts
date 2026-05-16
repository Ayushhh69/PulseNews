/**
 * Navigation type definitions.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { Article } from '../types/article';

// ─── Stack Param Lists ──────────────────────────────────────────

export type HomeStackParamList = {
  HomeFeed: undefined;
  ArticleDetail: { article: Article };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  ArticleDetail: { article: Article };
};

export type BookmarksStackParamList = {
  BookmarksList: undefined;
  ArticleDetail: { article: Article };
};

// ─── Tab Param List ─────────────────────────────────────────────

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  BookmarksTab: NavigatorScreenParams<BookmarksStackParamList>;
};

// ─── Screen Props ───────────────────────────────────────────────

export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeFeed'>,
  BottomTabScreenProps<TabParamList>
>;

export type SearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, 'SearchMain'>,
  BottomTabScreenProps<TabParamList>
>;

export type BookmarksScreenProps = CompositeScreenProps<
  NativeStackScreenProps<BookmarksStackParamList, 'BookmarksList'>,
  BottomTabScreenProps<TabParamList>
>;

export type ArticleDetailScreenProps =
  | NativeStackScreenProps<HomeStackParamList, 'ArticleDetail'>
  | NativeStackScreenProps<SearchStackParamList, 'ArticleDetail'>
  | NativeStackScreenProps<BookmarksStackParamList, 'ArticleDetail'>;
