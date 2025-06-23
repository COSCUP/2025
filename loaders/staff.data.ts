import { defineLoader } from 'vitepress'
import { conference } from '../data/conference'

interface StaffMember {
  name: string
  email_hash: string
}

interface StaffGroup {
  name: string
  tid: string
  chiefs: StaffMember[]
  members: StaffMember[]
  group: {
    zh_tw: string
    en: string
  }
}

interface StaffData {
  staffData: StaffGroup[]
}

async function fetchStaffData(): Promise<StaffGroup[]> {
  const response = await fetch(`https://volunteer.coscup.org/api/members?pid=${conference.year}`)
  const json = await response.json()

  return json.data.map((group: any) => {
    const chiefs: StaffMember[] = group.chiefs
    const members: StaffMember[] = group.members

    const chiefEmails = new Set(chiefs.map((c) => c.email_hash))
    const emailToMember = new Map(members.map((m) => [m.email_hash, m]))

    const sortedChiefsInMembers = chiefs
      .map((c) => emailToMember.get(c.email_hash))
      .filter((m): m is StaffMember => !!m)

    const remainingMembers = members.filter((m) => !chiefEmails.has(m.email_hash))
    const [zhTwGroup, enGroup] = group.name.split(' - ')

    return {
      ...group,
      group: {
        zh_tw: zhTwGroup,
        en: enGroup,
      },
      members: [...sortedChiefsInMembers, ...remainingMembers],
    }
  })
}

export declare const data: StaffData

export default defineLoader({
  async load(): Promise<StaffData> {
    const staffData = await fetchStaffData()

    return { staffData }
  },
})
