import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme
