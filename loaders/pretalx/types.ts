export interface MultiLingualString {
  'en': string
  'zh-tw': string
}

export type OptionalMultiLingualString = Partial<MultiLingualString>

export interface Room {
  id: number
  name: MultiLingualString
}

export interface LocalizedRoom {
  id: number
  name: string
}

export interface Speaker {
  code: string
  name: string
  bio?: string
  avatar: string
}

export interface LocalizedSpeaker {
  code: string
  name: string
  bio?: string
  avatar: string
}

export interface LocalizedBriefSpeaker {
  id: number
  name: string
  avatar: string
}

export interface SessionType {
  id: number
  name: MultiLingualString
}

export interface LocalizedSessionType {
  id: number
  name: string
}

export interface Submission {
  code: string
  title: MultiLingualString
  abstract: OptionalMultiLingualString
  speakers: string[]
  track: number
  room: number
  start: string // ISO8601
  end: string // ISO8601
  language: MultiLingualString
  difficulty: MultiLingualString
  co_write?: string
  qa?: string
  slide?: string
  record?: string
}

export interface LocalizedSubmission {
  code: string
  title: string
  abstract?: string
  speakers: string[]
  track: number
  room: number
  start: string // ISO8601
  end: string // ISO8601
  language: string
  difficulty: string
  co_write?: string
  qa?: string
  slide?: string
  record?: string
}

export interface Track {
  id: number
  name?: MultiLingualString
  description?: OptionalMultiLingualString
  color: string
}

export interface LocalizedTrack {
  id: number
  name?: string
  description?: string
  color: string
}
