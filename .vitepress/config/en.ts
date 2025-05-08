import { defineConfig } from 'vitepress'

export const en = defineConfig({
  lang: 'en-US',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/en' },
      { text: 'Event', link: '/en/event' },
      { text: 'About', link: '/en/about' },
      { text: 'Participate', link: '/en/participate' },
    ],
    sidebar: [
      {
        text: 'Participate',
        link: '/participate',
        items: [
          { text: 'As Attendee', link: '/participate/attendee' },
          { text: 'As Community', link: '/participate/community' },
          { text: 'As Speaker', link: '/participate/speaker' },
          { text: 'As Sponsor', link: '/participate/sponsor' },
          { text: 'As Organizing', link: '/participate/organizing' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/COSCUP' },
    ],
  },
})
