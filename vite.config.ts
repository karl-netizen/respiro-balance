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
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent' 
    },
    // Treat unused variables as warnings during development
    logLevel: 'warning',
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
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // Core vendor chunks
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }

            // UI component chunks - split into smaller pieces
            if (id.includes('@radix-ui/react-dialog')) {
              return 'ui-radix-dialog';
            }
            if (id.includes('@radix-ui/react-checkbox') ||
                id.includes('@radix-ui/react-radio-group') ||
                id.includes('@radix-ui/react-select') ||
                id.includes('@radix-ui/react-slider') ||
                id.includes('@radix-ui/react-switch')) {
              return 'ui-radix-forms';
            }
            if (id.includes('@radix-ui/react-tabs') ||
                id.includes('@radix-ui/react-accordion') ||
                id.includes('@radix-ui/react-collapsible') ||
                id.includes('@radix-ui/react-separator')) {
              return 'ui-radix-layout';
            }
            if (id.includes('@radix-ui/react-popover') ||
                id.includes('@radix-ui/react-tooltip') ||
                id.includes('@radix-ui/react-hover-card') ||
                id.includes('@radix-ui/react-dropdown-menu')) {
              return 'ui-radix-overlay';
            }
            if (id.includes('lucide-react')) {
              return 'ui-icons';
            }
            if (id.includes('framer-motion')) {
              return 'ui-motion';
            }

            // Charts (large dependency) - split further
            if (id.includes('recharts')) {
              return 'charts';
            }

            // Form handling
            if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
              return 'forms';
            }

            // Utilities
            if (id.includes('clsx') || id.includes('class-variance-authority') ||
                id.includes('tailwind-merge') || id.includes('date-fns')) {
              return 'utils';
            }

            // Supabase
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase';
            }

            // Stripe
            if (id.includes('@stripe/stripe-js')) {
              return 'stripe';
            }
          }

          // Split large page components into separate chunks
          if (id.includes('/src/pages/')) {
            const pageName = id.split('/pages/')[1]?.split('.')[0];
            if (pageName) {
              // Group smaller pages together
              if (['LoginPage', 'RegisterPage', 'ForgotPasswordPage', 'ResetPasswordPage'].some(p => pageName.includes(p))) {
                return 'pages-auth';
              }
              if (['HelpPage', 'ContactPage', 'PrivacyPage', 'TermsPage'].some(p => pageName.includes(p))) {
                return 'pages-info';
              }
              // Keep large pages separate
              if (['Dashboard', 'MorningRitual'].includes(pageName)) {
                return `page-${pageName.toLowerCase()}`;
              }
            }
          }
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 600, // Increased limit since we're using lazy loading
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
