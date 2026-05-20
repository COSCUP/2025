import { defineLoader, loadEnv } from 'vitepress'
import { getDriveImage } from './utils'

// API 設定
const env = loadEnv('', process.cwd())
const SHEET_ID = env.VITE_SHEET_ID
const SPONSOR_SHEET_NAME = env.VITE_SPONSOR_SHEET_NAME
const API_KEY = env.VITE_API_KEY

interface SpreadsheetData {
  values: string[][]
}

export interface Sponsor {
  'id': string
  'image': string
  'name:zh-TW': string
  'name:en': string
  'intro:zh-TW': string
  'intro:en': string
  'link': string
  'level': string
  'canPublish': 'Y' | 'N'
  'type': string
  'times': string
}

type GroupedSponsors = Record<string, Sponsor[]>

// 定義贊助商等級
export const sponsorLevels = [
  'titanium',
  'gold',
  'silver',
  'bronze',
  'friend',
  'over-seas',
  'co-promotion-partner',
  'co-host',
  'co-organizer',
  'special-thanks',
]

export const sponsorLevels_mapping: Record<string, string> = {
  'titanium': '鈦金級贊助',
  'gold': '黃金級贊助',
  'silver': '白銀級贊助',
  'bronze': '青銅級贊助',
  'friend': '好朋友級贊助',
  'over-seas': '海外講者旅遊補助',
  'co-promotion-partner': '共同推廣夥伴',
  'co-host': '共同主辦單位',
  'co-organizer': '協辦單位',
  'special-thanks': '特別感謝',
}

// 取得 Google Sheets 資料
async function fetchSponsors(): Promise<Sponsor[]> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SPONSOR_SHEET_NAME}?key=${API_KEY}`
    const response = await fetch(url)
    const data: SpreadsheetData = await response.json()

    if (!data.values) throw new Error('No data found in the spreadsheet')

    // First row is the header, subsequent rows are the data
    const [headers, ...values] = data.values

    // Map the data to the Sponsor interface
    const sponsors = values
      .map((row) =>
        headers.reduce((obj, key, i) => ({
          ...obj,
          [key]: row[i] || '',
        }), {} as Sponsor))
      .filter((sponsor) => sponsor.id && sponsor.canPublish === 'Y')

    return sponsors.map((sponsor) => ({
      ...sponsor,
      image: getDriveImage(sponsor.image),
    }))
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return []
  }
}

// 根據等級分類贊助商
function groupSponsorsByLevel(sponsors: Sponsor[]): GroupedSponsors {
  return sponsors.reduce((acc, sponsor) => {
    const level = sponsor.level || 'unknown'
    if (!acc[level]) acc[level] = []
    acc[level].push(sponsor)
    return acc
  }, {} as GroupedSponsors)
}

interface SponsorData {
  sponsors: Sponsor[]
  sponsorLevels: string[]
  sponsorLevels_mapping: Record<string, string>
  groupedSponsors: GroupedSponsors
}

export declare const data: SponsorData

export default defineLoader({
  async load(): Promise<SponsorData> {
    const sponsors = await fetchSponsors()
    const groupedSponsors = groupSponsorsByLevel(sponsors)

    return {
      sponsors,
      sponsorLevels,
      sponsorLevels_mapping,
      groupedSponsors,
    }
  },
})
