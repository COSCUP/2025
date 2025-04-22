export interface PretalxMultiLingualString {
  'en'?: string
  'zh-tw'?: string
}

export interface PretalxQuestion {
  id: number
  question: {
    en: string
  }
  required: boolean
  target: string
  options: unknown[]
}

export interface PretalxAnswer {
  id: number
  question: PretalxQuestion
  answer: string
  answer_file: string | null
  submission: string
  person: unknown | null
  options: Array<{
    answer: {
      en: string
    }
  }>
}

export interface PretalxSlot {
  start: string
  end: string
  room: PretalxMultiLingualString & {
    room_id?: number
  }
}

export interface PretalxSpeakerReference {
  name: string
  code: string
  biography: string
  email?: string
}

export interface PretalxTalk {
  code: string
  speakers: PretalxSpeakerReference[]
  title: string
  submission_type: {
    en: string
  }
  track: PretalxMultiLingualString | null
  track_id?: number
  state: 'submitted' | 'accepted' | 'rejected' | 'confirmed'
  abstract: string
  description: string
  duration: number | null
  do_not_record: boolean
  is_featured: boolean
  content_locale: string
  slot: PretalxSlot
  answers: PretalxAnswer[]
  tags?: string[]
}

export interface PretalxRoom {
  id: number
  name: PretalxMultiLingualString
  description: PretalxMultiLingualString
  capacity: number
  position: number
}

export interface PretalxSpeaker {
  code: string
  name: string
  biography: string
  submissions: string[]
  avatar: string
  email?: string
  answers: PretalxAnswer[]
}

export interface PretalxResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
