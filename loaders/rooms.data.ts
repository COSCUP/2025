import type { PretalxResponse, PretalxRoom } from './pretalx/pretalx'
import type { Room } from './pretalx/types'
import { conference } from '#data/conference'
import { defineLoader } from 'vitepress'
import { processRooms } from './pretalx/processors'

export declare const data: Room[]

export default defineLoader({
  async load(): Promise<typeof data> {
    const { PRETALX_TOKEN: pretalxToken } = process.env
    const { year } = conference

    const headers = {
      Accept: 'application/json',
      ...(pretalxToken && { Authorization: `Token ${pretalxToken}` }),
    }

    const response = await fetch(`https://pretalx.coscup.org/api/events/coscup-${year}/rooms/?limit=500`, { headers })
    const rawData = await response.json() as PretalxResponse<PretalxRoom>
    const data = processRooms(rawData)

    return data
  },
})
