import { defineLoader, loadEnv } from 'vitepress'
import { getDriveImage } from './utils'

// API 設定
const env = loadEnv('', process.cwd())
const SHEET_ID = env.VITE_SHEET_ID
const SPONSOR_NEWS_SHEET_NAME = env.VITE_SPONSOR_NEWS_SHEET_NAME
const API_KEY = env.VITE_API_KEY

interface SpreadsheetData {
  values: string[][]
}

export interface SponsorNews {
  'sponsorId': string
  'newsId': string
  'image:vertical': string
  'image:horizontal': string
  'description': string
  'link': string
  'specialWeight': string
  'canPublish': 'Y' | 'N'
}

// 取得 Google Sheets 資料
async function fetchSponsorsNews(): Promise<SponsorNews[]> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SPONSOR_NEWS_SHEET_NAME}?key=${API_KEY}`
    const response = await fetch(url)
    const data: SpreadsheetData = await response.json()

    if (!data.values) throw new Error('No data found in the spreadsheet')

    // First row is the header, subsequent rows are the data
    const [headers, ...values] = data.values

    // Map the data to the SponsorNews interface
    const sponsors = values
      .map((row) =>
        headers.reduce((obj, key, i) => ({
          ...obj,
          [key]: row[i] || '',
        }), {} as SponsorNews))
      .filter((sponsor) => sponsor.sponsorId && sponsor.canPublish === 'Y')

    return sponsors.map((sponsor) => ({
      ...sponsor,
      'image:horizontal': getDriveImage(sponsor['image:horizontal']),
      'image:vertical': getDriveImage(sponsor['image:vertical']),
    }))
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return []
  }
}

export declare const data: SponsorNews[]

export default defineLoader({
  async load(): Promise<SponsorNews[]> {
    const sponsorNews = await fetchSponsorsNews()

    return sponsorNews
  },
})
