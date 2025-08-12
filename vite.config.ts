import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.wehand\.tennis\/v1\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wehand-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 5 * 60, // 5분
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
              },
            },
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1년
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        id: 'com.wehand.tennis',
        name: 'WeHand - 함께 치는 테니스',
        short_name: 'WeHand',
        description: '테니스 매칭과 커뮤니티를 한 번에! 함께 치는 테니스',
        theme_color: '#059669', // 테니스 코트 그린
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait-primary',
        categories: ['sports', 'social', 'health'],
        lang: 'ko',
        dir: 'ltr',
        launch_handler: {
          client_mode: ['navigate-existing', 'auto']
        },
        iarc_rating_id: 'e84b072d-71b3-4d3e-86ae-31a8ce4e53b7',
        prefer_related_applications: false,
        related_applications: [
          {
            platform: 'play',
            url: 'https://play.google.com/store/apps/details?id=com.wehand.tennis',
            id: 'com.wehand.tennis'
          },
          {
            platform: 'itunes',
            url: 'https://apps.apple.com/app/wehand-tennis/id1234567890'
          }
        ],
        scope_extensions: [
          {
            origin: 'https://wehand-api.zigae.com'
          },
          {
            origin: 'https://wehand.zigae.com'
          }
        ],
        screenshots: [
          {
            src: 'screenshots/home.png',
            sizes: '390x844',
            type: 'image/png',
            label: '홈 화면'
          },
          {
            src: 'screenshots/match.png',
            sizes: '390x844',
            type: 'image/png',
            label: '매치 목록'
          },
          {
            src: 'screenshots/board.png',
            sizes: '390x844',
            type: 'image/png',
            label: '게시판'
          },
          {
            src: 'screenshots/profile.png',
            sizes: '390x844',
            type: 'image/png',
            label: '프로필'
          },
          {
            src: 'screenshots/dark_home.png',
            sizes: '390x844',
            type: 'image/png',
            label: '홈 화면 (다크 모드)'
          },
          {
            src: 'screenshots/dark_match.png',
            sizes: '390x844',
            type: 'image/png',
            label: '매치 목록 (다크 모드)'
          },
          {
            src: 'screenshots/dark_profile.png',
            sizes: '390x844',
            type: 'image/png',
            label: '프로필 (다크 모드)'
          }
        ],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },
      devOptions: {
        enabled: true // 개발 환경에서도 PWA 테스트 가능
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})