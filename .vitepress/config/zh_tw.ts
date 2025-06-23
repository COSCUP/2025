import { defineConfig } from 'vitepress'

export const zh_tw = defineConfig({
  lang: 'zh_tw',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: '年會資訊', link: '/event' },
      { text: '關於我們', link: '/about' },
      { text: '工作人員', link: '/staff' },
    ],
    sidebar: {},
    socialLinks: [
      { icon: 'github', link: 'https://github.com/COSCUP' },
    ],

    docFooter: {
      prev: '上一頁',
      next: '下一頁',
    },

    outline: {
      label: '導覽',
    },

    langMenuLabel: '其他語言',
    returnToTopLabel: '回到頂部',
    sidebarMenuLabel: '目錄',
    darkModeSwitchLabel: '主題',
    lightModeSwitchTitle: '浅色模式',
    darkModeSwitchTitle: '深色模式',
  },
})
