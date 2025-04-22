import type { Tag } from './types'

export const QUESTION_ID_SPEAKER_ZH_NAME = 0
export const QUESTION_ID_SPEAKER_ZH_BIO = 0
export const QUESTION_ID_SPEAKER_EN_NAME = 0
export const QUESTION_ID_SPEAKER_EN_BIO = 174
export const QUESTION_ID_SESSION_ZH_DESC = 0
export const QUESTION_ID_SESSION_EN_TITLE = 173
export const QUESTION_ID_SESSION_EN_DESC = 175
export const QUESTION_ID_SESSION_TAGS = 220
export const QUESTION_ID_SESSION_QA = 0
export const QUESTION_ID_SESSION_SLIDE = 0
export const QUESTION_ID_SESSION_RECORD = 2098

export const LANGUAGE_MAPPING: Record<string, string> = {
  Chinese: 'zh-tw',
  English: 'en',
  Japanese: 'ja-JP',
  日文: 'ja-JP',
  Taiwanese: 'taiwanese',
}

export const AVAILABLE_TAGS: Tag[] = [
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
