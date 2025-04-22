import type {
  Sessions,
} from './sessions/types'
import { conference } from '#data/conference'
import { defineLoader } from 'vitepress'
import { generateResult } from './sessions/processors'

export * from './sessions/types'

export declare const data: Sessions

async function load(): Promise<Sessions> {
  const { PRETALX_TOKEN: pretalxToken } = process.env

  const { year } = conference

  const commonHeaders = {
    'User-Agent': `coscup-${year}-homepage-data-loader/v1`,
    'Accept': 'application/json',
  }

  const pretalxHeaders = {
    ...commonHeaders,
    ...(pretalxToken && { Authorization: `Token ${pretalxToken}` }),
  }

  try {
    const [collaborativeWritingMap, talksResponse, roomsResponse, speakersResponse] = await Promise.all([
      fetch(`https://github.com/COSCUP/${year}/raw/master/scripts/pre-build/hackmd_url_mappings.json`, { headers: commonHeaders })
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
