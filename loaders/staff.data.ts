import staffJson from '#data/staff.json'
import { defineLoader } from 'vitepress'

interface StaffMember {
  name: string
  email_hash: string
}

interface StaffGroup {
  tid: string
  group: {
    zh_tw: string
    en: string
  }
  members: StaffMember[]
}

interface StaffData {
  staffData: StaffGroup[]
}

/**
 * The list of staff groups and their members.
 *
 * Captured from the deployed coscup.org/2025/staff page and shipped as static
 * data — the original `volunteer.coscup.org` API has been shut down.
 *
 * To refresh, scrape the rendered group sections from the staff page (each
 * `.group-section` contains a `.group-name` and a list of `.member-card` with
 * `.name` plus a Gravatar avatar URL whose hash is the member's `email_hash`).
 */
export declare const data: StaffData

export default defineLoader({
  async load(): Promise<StaffData> {
    return staffJson as StaffData
  },
})
