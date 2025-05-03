import { defineConfig } from 'vitepress'

export const en = defineConfig({
  lang: 'en-US',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/en' },
      { text: 'Event', link: '/en/event' },
      { text: 'Participate', link: '/en/participate/attendee' },
      { text: 'About', link: '/en/about' },
    ],
    sidebar: {
      '/en/participate': [
        {
          text: 'Participate',
          link: '/en/participate/attendee',
          items: [
            { text: 'As Attendee', link: '/en/participate/attendee' },
            { text: 'As Community', link: '/en/participate/community' },
            { text: 'As Speaker', link: '/en/participate/speaker' },
            { text: 'As Sponsor', link: '/en/participate/sponsor' },
            { text: 'As Organizing', link: '/en/participate/organizing' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/COSCUP' }],
    docFooter: {
      prev: 'Previous page',
      next: 'Next Page',
    },

    outline: {
      label: '導覽',
    },

    langMenuLabel: 'Other Languages',
    returnToTopLabel: '回到頂部',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
    lightModeSwitchTitle: 'Light Mode',
    darkModeSwitchTitle: 'Dark Mode',
  },
})
