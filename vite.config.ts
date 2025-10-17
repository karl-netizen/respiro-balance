import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      strict: false
    },
    // Security headers in development
    headers: mode === 'development' ? {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    } : {}
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      // Externalize Capacitor dependencies for web builds
      external: [
        '@capacitor/core',
        '@capacitor/android',
        '@capacitor/ios',
        '@capacitor-community/bluetooth-le'
      ],
      output: {
        manualChunks: {
          // Core vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],

          // UI component chunks - split into smaller pieces
          'ui-radix-dialog': ['@radix-ui/react-dialog'],
          'ui-radix-forms': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
          ],
          'ui-radix-layout': [
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-separator',
          ],
          'ui-radix-overlay': [
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-dropdown-menu',
          ],
          'ui-icons': ['lucide-react'],
          'ui-motion': ['framer-motion'],

          // Charts (large dependency)
          'charts': ['recharts'],

          // Form handling
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // Utilities
          'utils': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'date-fns'
          ],

          // Supabase
          'supabase': ['@supabase/supabase-js'],

          // Stripe
          'stripe': ['@stripe/stripe-js'],
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
