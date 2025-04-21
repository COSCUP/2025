import type { Theme } from 'vitepress'
import Banner from '#components/Banner.vue'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => h(Banner),
    })
  },
} satisfies Theme
