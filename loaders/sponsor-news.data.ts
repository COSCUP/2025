import { defineLoader, loadEnv } from 'vitepress'

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

// 轉換 Google Drive 圖片 URL
async function getDriveImageBase64(shareUrl: string): Promise<string> {
  if (!shareUrl) {
    return ''
  }

  const fileIdMatch = shareUrl.match(/(?:\/d\/|id=)([^/?]+)/)
  const fileId = fileIdMatch ? fileIdMatch[1] : null

  // Origin: https://drive.usercontent.google.com
  const directUrl = `https://coscup-2025-drive-cache.b-cdn.net/download?id=${fileId}&export=view`
  const response = await fetch(directUrl)

  if (!response.ok) {
    throw new Error(`Failed to fetch image from Google Drive: ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return `data:${response.headers.get('content-type') || 'image/jpeg'};base64,${buffer.toString('base64')}`
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

    return await Promise.all(sponsors.map(async (sponsor) => ({
      ...sponsor,
      'image:horizontal': await getDriveImageBase64(sponsor['image:horizontal']) || '',
      'image:vertical': await getDriveImageBase64(sponsor['image:vertical']) || '',
    })))
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
