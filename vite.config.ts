import { fileURLToPath, URL } from 'node:url'
import { TDesignResolver } from '@tdesign-vue-next/auto-import-resolver'

import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({}),
    vue(),
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: 'mobile-vue',
        }),
      ],
      imports: [VueRouterAutoImports, 'vue'],
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: 'mobile-vue',
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0', // ✅ 已配置：监听所有网络接口
    port: 18000, // 端口
    open: '/', // 启动时自动打开首页
    // https: false,
    proxy: {
      '/api/tencent/map': {
        target: 'https://apis.map.qq.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/tencent\/map/, ''),
      },
    },
  },
})
