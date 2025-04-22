export const sessionTags: Tag[] = [
  {
    id: 'Prime',
    zh: { name: 'Prime session' },
    en: { name: 'Prime session' },
  },
  {
    id: 'Elementary',
    zh: { name: '入門' },
    en: { name: 'Elementary' },
  },
  {
    id: 'Middle',
    zh: { name: '中階' },
    en: { name: 'Middle' },
  },
  {
    id: 'Advance',
    zh: { name: '進階' },
    en: { name: 'Advance' },
  },
  {
    id: 'Professional',
    zh: { name: '專業' },
    en: { name: 'Professional' },
  },
  {
    id: 'zh-tw',
    zh: { name: '中文' },
    en: { name: 'Chinese' },
  },
  {
    id: 'en',
    zh: { name: 'English' },
    en: { name: 'English' },
  },
  {
    id: 'ja-JP',
    zh: { name: '日本語' },
    en: { name: 'Japanese' },
  },
  {
    id: 'taiwanese',
    zh: { name: '台語' },
    en: { name: 'Taiwanese' },
  },
]

export interface Tag {
  id: string
  zh: { name: string }
  en: { name: string }
}
