/**
 * Pre-build asset pipeline: pulls every Google Drive image referenced by the
 * Sponsor / SponsorNews / Community sheets, compresses to WebP via sharp, and
 * writes the result to `content/public/assets/drive/{fileId}.webp` (under
 * VitePress's `srcDir`, served at `/${conference.year}/assets/drive/...`).
 * The loaders then point at those local paths instead of an external CDN.
 *
 * Run with `pnpm assets:download` whenever the source sheets change. The
 * `.webp` outputs are committed to the repo so CI builds need no network.
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'
import { loadEnv } from 'vitepress'

import { extractDriveId, getGoogleSheet } from '../loaders/utils.ts'

const env = loadEnv('', process.cwd())
const SHEET_ID = env.VITE_SHEET_ID
const API_KEY = env.VITE_API_KEY
const SPONSOR_SHEET_NAME = env.VITE_SPONSOR_SHEET_NAME
const SPONSOR_NEWS_SHEET_NAME = env.VITE_SPONSOR_NEWS_SHEET_NAME
const COMMUNITY_SHEET_NAME = env.VITE_COMMUNITY_SHEET_NAME

const OUTPUT_DIR = path.resolve(process.cwd(), 'content/public/assets/drive')
const CONCURRENCY = 8
const WEBP_QUALITY = 85

interface SponsorRow extends Record<string, string> {
  image: string
}
interface SponsorNewsRow extends Record<string, string> {
  'image:horizontal': string
  'image:vertical': string
}
interface CommunityRow extends Record<string, string> {
  image: string
}

async function collectDriveIds(): Promise<string[]> {
  const [sponsors, sponsorNews, communities] = await Promise.all([
    getGoogleSheet<SponsorRow>({
      sheetId: SHEET_ID,
      sheetName: SPONSOR_SHEET_NAME,
      apiKey: API_KEY,
    }),
    getGoogleSheet<SponsorNewsRow>({
      sheetId: SHEET_ID,
      sheetName: SPONSOR_NEWS_SHEET_NAME,
      apiKey: API_KEY,
    }),
    getGoogleSheet<CommunityRow>({
      sheetId: SHEET_ID,
      sheetName: COMMUNITY_SHEET_NAME,
      apiKey: API_KEY,
    }),
  ])

  const urls = [
    ...sponsors.map((row) => row.image),
    ...sponsorNews.flatMap((row) => [
      row['image:horizontal'],
      row['image:vertical'],
    ]),
    ...communities.map((row) => row.image),
  ]

  return [
    ...new Set(
      urls.map(extractDriveId).filter((id): id is string => Boolean(id)),
    ),
  ]
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function downloadAndConvert(id: string): Promise<void> {
  const outPath = path.join(OUTPUT_DIR, `${id}.webp`)
  const url = `https://drive.google.com/uc?export=view&id=${id}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }

  // Drive returns an HTML interstitial for files that trigger virus-scan
  // warnings (typically >25 MB). Refuse to silently write that as an image.
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('text/html')) {
    throw new Error(
      `Drive returned HTML interstitial (content-type: ${contentType}); file may be too large or not publicly shared`,
    )
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const webp = await sharp(buffer, { animated: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
  await writeFile(outPath, webp)
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let cursor = 0
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (cursor < items.length) {
        const index = cursor++
        await worker(items[index])
      }
    },
  )
  await Promise.all(workers)
}

async function main(): Promise<void> {
  const required = {
    VITE_SHEET_ID: SHEET_ID,
    VITE_API_KEY: API_KEY,
    VITE_SPONSOR_SHEET_NAME: SPONSOR_SHEET_NAME,
    VITE_SPONSOR_NEWS_SHEET_NAME: SPONSOR_NEWS_SHEET_NAME,
    VITE_COMMUNITY_SHEET_NAME: COMMUNITY_SHEET_NAME,
  }
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([name]) => name)
  if (missing.length > 0) {
    console.error(
      `Missing required env var(s): ${missing.join(', ')}. Populate your .env first.`,
    )
    process.exit(1)
  }

  await mkdir(OUTPUT_DIR, { recursive: true })
  const ids = await collectDriveIds()
  console.log(
    `Found ${ids.length} unique Drive image(s) across the three sheets.`,
  )

  let downloaded = 0
  let cached = 0
  const failures: { id: string, error: string }[] = []

  await runWithConcurrency(ids, CONCURRENCY, async (id) => {
    const outPath = path.join(OUTPUT_DIR, `${id}.webp`)
    if (await fileExists(outPath)) {
      cached++
      return
    }
    try {
      await downloadAndConvert(id)
      downloaded++
      console.log(`  downloaded ${id}.webp`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      failures.push({ id, error: message })
      console.error(`  failed ${id}: ${message}`)
    }
  })

  console.log(
    `\nDone. downloaded=${downloaded} cached=${cached} failed=${failures.length}`,
  )

  if (failures.length > 0) {
    process.exit(1)
  }
}

await main()
