/**
 * PulseNews - Smart News Aggregator App
 *
 * Entry point with Redux Provider and PersistGate.
 * Handles app lifecycle (foreground, background, inactive).
 */
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

// Suppress known warnings in dev
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

/**
 * Inner app component that handles lifecycle events.
 */
const AppContent: React.FC = () => {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // App came to foreground - could trigger refresh here
          if (__DEV__) {
            console.log('[Lifecycle] App returned to foreground');
          }
        }

        if (nextAppState === 'background') {
          // App going to background - persist state is handled by redux-persist
          if (__DEV__) {
            console.log('[Lifecycle] App going to background');
          }
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return <AppNavigator />;
};

/**
 * Root App component with all providers.
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;
