import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  // base:
  //   process.env.NODE_ENV === 'production' ? '/hanacapital-ts-mo/' : '/',
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
    // GitHub Pages 배포를 위한 추가 설정
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 더 작은 청크로 분할
            if (id.includes('chart.js')) {
              return 'chart';
            }
            if (id.includes('vue')) {
              return 'vue';
            }
            return 'vendor';
          }
        },
        chunkSizeWarningLimit: 1000, // 청크 크기 경고 제한 증가
        terserOptions: {
          compress: {
            drop_console: true, // console.log 제거
            drop_debugger: true,
          },
        },
        // 에셋 파일명 설정
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|ico|webp)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        // 청크 파일명 설정
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // 메인 엔트리 파일명 설정
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // 소스맵 생성
    sourcemap: false,
  },
});
