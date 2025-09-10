import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export default defineConfig({
  title: 'TDesign Starter Apply',
  description: '',
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin(),
    ],
  },
  themeConfig: {
    logo: 'https://tdesign.gtimg.com/mobile/demos/logo2.png',
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '文档', link: '/docs/get-started' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '简介',
          items: [
            { text: '项目介绍', link: '/guide/introduction' },
          ],
        },
      ],
      '/docs/': [
        {
          text: '上手',
          items: [
            { text: '快速开始', link: '/docs/get-started' },
          ],
        },
        {
          text: '开发',
          items: [
            { text: '进入开发', link: '/docs/develop' },
            { text: '开发规范', link: '/docs/develop-rules' },
            { text: '路由配置', link: '/docs/router' },
            { text: '请求与数据', link: '/docs/request-data' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TDesignOteam/tdesign-mobile-vue-starter-apply' },
    ],
  },
})
