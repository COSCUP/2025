import type {
  Sessions,
} from './sessions/types'
import { defineLoader, loadEnv } from 'vitepress'
import { generateResult } from './sessions/processors'

export * from './sessions/types'

export declare const data: Sessions

async function load(): Promise<Sessions> {
  // Read the Pretalx token from process.env instead of .env
  // to prevent token leakage in the frontend.
  const { PRETALX_TOKEN: pretalxToken } = process.env

  const { VITE_YEAR } = loadEnv('', process.cwd())
  const year = VITE_YEAR ?? '2024'

  const commonHeaders = {
    'User-Agent': 'coscup-2025-homepage-data-loader/v1',
    'Accept': 'application/json',
  }

  const pretalxHeaders = {
    ...commonHeaders,
    ...(pretalxToken && { Authorization: `Token ${pretalxToken}` }),
  }

  try {
    const [collaborativeWritingMap, talksResponse, roomsResponse, speakersResponse] = await Promise.all([
      fetch('https://github.com/COSCUP/2024/raw/master/scripts/pre-build/hackmd_url_mappings.json', { headers: commonHeaders })
        .then((response) => response.json()),
      fetch(`https://pretalx.coscup.org/api/events/coscup-${year}/talks/?limit=500`, { headers: pretalxHeaders })
        .then((response) => response.json()),
      fetch(`https://pretalx.coscup.org/api/events/coscup-${year}/rooms/?limit=500`, { headers: pretalxHeaders })
        .then((response) => response.json()),
      fetch(`https://pretalx.coscup.org/api/events/coscup-${year}/speakers/?limit=500`, { headers: pretalxHeaders })
        .then((response) => response.json()),
    ])

    return generateResult({
      talksResponse,
      roomsResponse,
      speakersResponse,
      collaborativeWritingMap,
      year,
    })
  } catch (error) {
    console.error('Error loading sessions:', error)
    return {
      sessions: [],
      speakers: [],
      session_types: [],
      rooms: [],
      tags: [],
    }
  }
}

export default defineLoader({ load })
