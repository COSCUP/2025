import type { PretalxResponse, PretalxSpeaker } from './pretalx/pretalx'
import type { Speaker } from './session.data'
import { conference } from '#data/conference'
import { defineLoader } from 'vitepress'
import { processSpeakers } from './pretalx/processors'

export declare const data: Speaker[]

export default defineLoader({
  async load(): Promise<typeof data> {
    const { PRETALX_TOKEN: pretalxToken } = process.env
    const { year } = conference

    const headers = {
      Accept: 'application/json',
      ...(pretalxToken && { Authorization: `Token ${pretalxToken}` }),
    }

    const response = await fetch(`https://pretalx.coscup.org/api/events/coscup-${year}/speakers/?limit=500`, { headers })
    const rawData = await response.json() as PretalxResponse<PretalxSpeaker>
    const data = processSpeakers(rawData)

    return data
  },
})
