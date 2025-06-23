import { resolve } from 'node:path'
// @ts-expect-error - No type definitions available
import markdownItContainer from 'markdown-it-container'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vitepress'

// Subpath imports (e.g. '#data') for TypeScript files are not supported
// See https://github.com/vuejs/vitepress/issues/4173

import { conference } from '../../data/conference'
import { en } from './en'
import { zh_tw } from './zh_tw'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(markdownItContainer, 'div', {
        render(tokens: Array<{ info: string }>, idx: number) {
          const token = tokens[idx] as { info: string, nesting: number }
          const klass = token.info.trim().slice(3).trim()
          if (token.nesting === 1) {
            return `<div class="${klass}">\n`
          } else {
            // 结束标签
            return '</div>\n'
          }
        },
      })
    },
  },
  vite: {
    resolve: {
      alias: {
        '/@': resolve(__dirname, '../..'),
      },
    },
    plugins: [
      Components({
        // Auto import components and icons in Vue and Markdown files
        dirs: ['../components', '.'],
        include: [/\.vue($|\?)/, /\.md($|\?)/],
        resolvers: [
          IconsResolver({
            prefix: 'icon',
            customCollections: ['local'],
          }),
        ],
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          local: FileSystemIconLoader('assets/icons'),
        },
      }),
    ],
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('swiper'),
      },
    },
  },
  title: conference.title,
  description: conference.description,
  head: [
    ['link', { href: conference.favicon, rel: 'icon' }],
    ['meta', { property: 'og:description', content: conference.description }],
    ['meta', { property: 'og:url', content: conference.url }],
    ['meta', { property: 'og:type', content: conference.type }],
    ['meta', { property: 'og:site_name', content: conference.site_name }],
    ['meta', { property: 'og:image', content: conference.og_image }],
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-C9EMTMDSS1' }],
    [
      'script',
      {},
      `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-C9EMTMDSS1');
      `,
    ],
  ],
  srcDir: 'content',
  srcExclude: ['**/parts/**'],
  base: `/${conference.year}`,
  cleanUrls: true,
  rewrites: {
    'zh_tw/:rest*': ':rest*',
  },
  locales: {
    root: { label: '繁體中文', ...zh_tw },
    en: { label: 'English', ...en },
  },
  appearance: false,
})
