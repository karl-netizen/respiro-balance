import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
    mode === 'development' &&
    componentTagger(),
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
      output: {
        manualChunks: {
          // Core vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          
          // UI component chunks
          'ui-radix': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-tabs', 
            '@radix-ui/react-slot',
            '@radix-ui/react-avatar',
            '@radix-ui/react-button',
            '@radix-ui/react-dropdown-menu'
          ],
          'ui-components': [
            'lucide-react',
            'framer-motion'
          ],
          
          // Security and performance chunks
          'security-features': [
            // Security-related modules would be auto-detected
          ],
          'performance-features': [
            'web-vitals'
          ],
          
          // Charts and analytics
          'charts': ['recharts'],
          
          // Utilities
          'utils': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'date-fns'
          ]
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 500, // Lower threshold for better performance
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
