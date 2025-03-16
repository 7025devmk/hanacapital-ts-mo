import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  base: process.env.NETLIFY ? '/' : '/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['duet-date-picker'].includes(tag),
        },
      },
    }),
    svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                cleanupIds: false,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: '8080',
    proxy: {
      '/api': {
        target: 'https://api.test.com:9090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/function.scss";
          @import "@/assets/scss/mixins.scss";
        `,
      },
    },
  },
  build: {
    outDir: 'dist/app',
    assetsDir: 'assets',
    minify: 'esbuild', // ESBuild 사용하여 빠른 빌드
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
        chunkSizeWarningLimit: 2000, // 청크 크기 경고 제한 증가
        terserOptions: {
          compress: {
            drop_console: true, // console.log 제거
            drop_debugger: true,
          },
        },
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop();
          if (/\.(png|jpe?g|gif|svg|ico|webp)$/.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(css)$/.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    sourcemap: false,
  },
});
