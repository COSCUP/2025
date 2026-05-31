import { conference } from '../data/conference.ts'

interface GoogleSheetResponse {
  majorDimension: string
  range: string
  values: string[][]
}

/**
 * Fetch a sheet from a Google Sheet and return the data as an array of objects.
 * @param options Options for fetching a Google Sheet.
 * @param options.sheetId The ID of the Google Sheet.
 * @param options.sheetName The name of the sheet within the Google Sheet.
 * @param options.apiKey The API key for accessing the Google Sheets API.
 * @template SheetRow The type of the objects in the returned array.
 * @returns A promise that resolves to an array of objects representing the data in the sheet.
 */
export async function getGoogleSheet<SheetRow extends Record<string, string>>({
  sheetId,
  sheetName,
  apiKey,
}: {
  sheetId: string
  sheetName: string
  apiKey: string
}): Promise<SheetRow[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}`)
  }

  const data: GoogleSheetResponse = await response.json()

  if (!data.values) throw new Error(`No data found in the ${sheetName} sheet`)

  // First row is the header, subsequent rows are the data
  const [headers, ...values] = data.values

  const result = values.map((row) =>
    headers.reduce((obj, key, i) => {
      obj[key] = row[i] || ''
      return obj
    }, {} as Record<string, string>),
  ) as SheetRow[]

  return result
}

/**
 * Extract the Google Drive file ID from a share URL like
 * `https://drive.google.com/file/d/{ID}/view`.
 *
 * @param imageUrl The Google Drive share URL.
 * @returns The file ID, or `null` if the URL is not in the expected shape.
 */
export function extractDriveId(imageUrl: string): string | null {
  if (!imageUrl) return null
  const match = imageUrl.match(/\/d\/([^/]+)\//)
  return match ? match[1] : null
}

/**
 * Map a Google Drive share URL to the local WebP asset path produced by
 * `scripts/assets-download.ts`. Includes the VitePress `base` prefix
 * (`/${conference.year}`) so the path resolves correctly when the site is
 * deployed under a subpath. Run the download script to refresh the files in
 * `content/public/assets/drive/` after the source Google Sheets change.
 *
 * @param imageUrl The Google Drive share URL.
 * @returns The absolute site path to the local WebP, or `''` if `imageUrl` is empty
 *   or unrecognized.
 */
export function getDriveImage(imageUrl: string): string {
  const id = extractDriveId(imageUrl)
  return id ? `/${conference.year}/assets/drive/${id}.webp` : ''
}
