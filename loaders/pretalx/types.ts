import type { Tag } from '#data/session-tags.ts'

export interface Sessions {
  sessions: Session[]
  speakers: Speaker[]
  session_types: SessionType[]
  rooms: Room[]
  tags: Tag[]
}

export interface LocalizedContent {
  title: string
  description: string
}

export interface LocalizedName {
  name: string
}

export interface Session {
  id: string
  type: string
  room: string
  start: string
  end: string
  language: string
  zh: LocalizedContent
  en: LocalizedContent
  speakers: string[]
  tags: string[]
  co_write?: string | null
  qa?: string | null
  slide?: string | null
  record?: string | null
  uri: string
}

export interface Speaker {
  id: string
  avatar: string
  zh: {
    name: string
    bio: string
  }
  en: {
    name: string
    bio: string
  }
}

export interface SessionType {
  id: string
  zh: LocalizedName
  en: LocalizedName
}

export interface Room {
  id: number
  zh: { name: string }
  en: { name: string }
}
