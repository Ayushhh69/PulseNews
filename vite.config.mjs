import { defineConfig } from 'vite';
import reactNativeWeb from 'vite-plugin-react-native-web';

export default defineConfig({
  plugins: [reactNativeWeb()],
  build: {
    outDir: 'dist',
  },
  // Suppress Vite 8 deprecation warning by defining the optimizeDeps block safely
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
    },
  },
});
