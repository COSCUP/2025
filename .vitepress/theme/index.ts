import type { Theme } from 'vitepress'
import Banner from '#components/Banner.vue'
import Footer from '#components/Footer.vue'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => h(Banner),
      'layout-bottom': () => h(Footer),
    })
  },
} satisfies Theme
