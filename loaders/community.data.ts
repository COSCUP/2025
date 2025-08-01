import { defineLoader, loadEnv } from 'vitepress'

// API 設定
const env = loadEnv('', process.cwd())
const SHEET_ID = env.VITE_SHEET_ID
const COMMUNITY_SHEET_NAME = env.VITE_COMMUNITY_SHEET_NAME
const API_KEY = env.VITE_API_KEY

interface SpreadsheetData {
  values: string[][]
}

export interface groupedCommunities extends Community {
  topics: Topics | undefined
  booths: Booths | undefined
}

interface Community {
  'id': string
  'name:zh-TW': string
  'name:en': string
  'intro:zh-TW': string
  'intro:en': string
  'link': string
  'image': string
}

interface Topics {
  'id': string
  'community_id': string
  'name:zh-TW': string
  'name:en': string
  'intro:zh-TW': string
  'intro:en': string
  'link': string
  'image': string
}

interface Booths {
  'id': string
  'community_id': string
  'name:zh-TW': string
  'name:en': string
  'intro:zh-TW': string
  'intro:en': string
  'link': string
  'image': string
  'community': string
  'room': string
  'trackroom': string
}

// 處理 Google Drive 圖片
async function getDriveImage(imageUrl: string): Promise<string> {
  if (!imageUrl) {
    return ''
  }

  const getImageID = imageUrl.match(/\/d\/([^/]+)\//)
  const imageID = getImageID ? getImageID[1] : null

  // Origin: https://drive.usercontent.google.com
  return `https://coscup-2025-drive-cache.b-cdn.net/download?id=${imageID}&export=view`
}

// 取得 Google Sheets 資料
async function fetchCommunities(): Promise<Community[]> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${COMMUNITY_SHEET_NAME}?key=${API_KEY}`
    const response = await fetch(url)
    const data: SpreadsheetData = await response.json()

    if (!data.values) throw new Error('No data found in the spreadsheet')

    // First row is the header, subsequent rows are the data
    const [headers, ...values] = data.values

    // Map the data to the Sponsor interface
    const communities = values.map((row) =>
      headers.reduce((obj, key, i) => ({
        ...obj,
        [key]: row[i] || '',
      }), {} as Community),
    )

    return Promise.all(communities.map(async (communities) => ({
      ...communities,
      image: await getDriveImage(communities.image),
    })))
  } catch (error) {
    console.error('Error fetching communities:', error)
    return []
  }
}

async function fetchGroupedCommunities(): Promise<groupedCommunities[]> {
  try {
    const communityData: Community[] = await fetchCommunities()
    // 獲取 Topics 資料
    const topicsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Topics?key=${API_KEY}`
    const topicsResponse = await fetch(topicsUrl)
    const topicsSheetData: SpreadsheetData = await topicsResponse.json()

    if (!topicsSheetData.values) throw new Error(`No data found in the Topics sheet`)

    const [, ...topicsSheetValues] = topicsSheetData.values
    const topicsValues: Topics[] = topicsSheetValues.map((data) => ({
      'id': data[0],
      'community_id': data[1],
      'name:zh-TW': data[2],
      'name:en': data[3],
      'intro:zh-TW': data[4],
      'intro:en': data[5],
      'link': data[6],
      'image': data[7],
    }))

    // 獲取 Booths 資料
    const boothsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Booths?key=${API_KEY}`
    const boothsResponse = await fetch(boothsUrl)
    const boothsSheetData: SpreadsheetData = await boothsResponse.json()

    if (!boothsSheetData.values) throw new Error(`No data found in the Booths sheet`)

    const [, ...boothsSheetValues] = boothsSheetData.values
    const boothsValues: Booths[] = boothsSheetValues.map((data) => ({
      'id': data[0],
      'community_id': data[1],
      'name:zh-TW': data[2],
      'name:en': data[3],
      'intro:zh-TW': data[4],
      'intro:en': data[5],
      'link': data[6],
      'image': data[7],
      'community': data[8],
      'room': data[9],
      'trackroom': data[10],
    }))

    const groupedData: groupedCommunities[] = communityData.map((communityInfo) => ({
      ...communityInfo,
      topics: topicsValues.find((topicsInfo) => communityInfo.id === topicsInfo.community_id),
      booths: boothsValues.find((boothsInfo) => communityInfo.id === boothsInfo.community_id),
    }))

    return groupedData
  } catch (error) {
    console.error(`Error fetching or processing:`, error)
    return []
  }
}

interface CommunityData {
  communities: groupedCommunities[]
}

export declare const data: CommunityData

export default defineLoader({
  async load(): Promise<CommunityData> {
    const communities: groupedCommunities[] = await fetchGroupedCommunities()

    return { communities }
  },
})
