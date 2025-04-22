import type {
  PretalxResponse,
  PretalxRoom,
  PretalxSpeaker,
  PretalxTalk,
} from './pretalx'
import type {
  Room,
  Session,
  Sessions,
  SessionType,
  Speaker,
} from './types'
import {
  AVAILABLE_TAGS,
  LANGUAGE_MAPPING,
  QUESTION_ID_SESSION_EN_DESC,
  QUESTION_ID_SESSION_EN_TITLE,
  QUESTION_ID_SESSION_LANGUAGE,
  QUESTION_ID_SESSION_QA,
  QUESTION_ID_SESSION_RECORD,
  QUESTION_ID_SESSION_SLIDE,
  QUESTION_ID_SESSION_TAGS,
  QUESTION_ID_SESSION_ZH_DESC,
  QUESTION_ID_SPEAKER_EN_BIO,
  QUESTION_ID_SPEAKER_EN_NAME,
  QUESTION_ID_SPEAKER_ZH_BIO,
  QUESTION_ID_SPEAKER_ZH_NAME,
} from './constants'
import { filterUnknownCharacters, generateMd5Base64Hash, generateMd5Hash, getAnswerFromQuestions } from './utils'

interface CollaborativeWriting {
  URL: string
}

function processRooms(roomsResponse: PretalxResponse<PretalxRoom>): Room[] {
  return roomsResponse.results
    .map((room) => {
      const roomId = room.name.en || room.name['zh-tw']
      if (!roomId) return null

      return {
        id: roomId,
        zh: {
          name: room.name['zh-tw'] || roomId,
        },
        en: {
          name: room.name.en || roomId,
        },
      }
    })
    .filter((room): room is Room => room !== null)
}

function processSpeakers(speakersResponse: PretalxResponse<PretalxSpeaker>): Speaker[] {
  return speakersResponse.results.map((speaker) => {
    const chineseBio = filterUnknownCharacters(getAnswerFromQuestions(speaker, QUESTION_ID_SPEAKER_ZH_BIO, speaker.biography || '-') || '')
    const englishBio = filterUnknownCharacters(getAnswerFromQuestions(speaker, QUESTION_ID_SPEAKER_EN_BIO, speaker.biography || '-') || '')

    return {
      id: speaker.code,
      avatar: speaker.avatar || `https://www.gravatar.com/avatar/${generateMd5Hash(speaker.email || '')}?s=1024&d=identicon&r=g`,
      zh: {
        name: getAnswerFromQuestions(speaker, QUESTION_ID_SPEAKER_ZH_NAME, speaker.name) || '',
        bio: chineseBio === '-' ? englishBio : chineseBio,
      },
      en: {
        name: getAnswerFromQuestions(speaker, QUESTION_ID_SPEAKER_EN_NAME, speaker.name) || '',
        bio: englishBio === '-' ? chineseBio : englishBio,
      },
    }
  })
}

function processSessionTypes(talksResponse: PretalxResponse<PretalxTalk>): SessionType[] {
  const uniqueTracks = talksResponse.results.map((talk) => talk.track).filter((track, index, tracks) =>
    index === tracks.findIndex((t) => t?.['zh-tw'] === track?.['zh-tw'] && t?.en === track?.en))

  return uniqueTracks.map((track) => {
    // hash the 'track' object to get a unique id
    const trackId = generateMd5Base64Hash(JSON.stringify(track))

    const sessionType: SessionType = {
      id: trackId,
      zh: {
        name: track?.['zh-tw'] || track?.en || 'main',
      },
      en: {
        name: track?.en || track?.['zh-tw'] || 'main',
      },
    }
    return sessionType
  })
}

function getSessionTags(talk: PretalxTalk): Set<string> {
  const languageAnswer = talk.answers.find((answer) => answer.question.id === QUESTION_ID_SESSION_LANGUAGE)?.options[0]?.answer.en
  const languageTags: string[] = languageAnswer && LANGUAGE_MAPPING[languageAnswer] ? [LANGUAGE_MAPPING[languageAnswer]] : []

  return new Set(languageTags
    .concat(talk.answers.find((answer) => answer.question.id === QUESTION_ID_SESSION_TAGS)?.options[0]?.answer.en ? [talk.answers.find((answer) => answer.question.id === QUESTION_ID_SESSION_TAGS)!.options[0].answer.en] : [])
    .concat(talk.tags?.includes('prime session') ? ['Prime'] : [])
    .concat(talk.submission_type.en === 'prime session' ? ['Prime'] : []))
}

function processSessions(
  talksResponse: PretalxResponse<PretalxTalk>,
  sessionTypes: SessionType[],
  collaborativeWritingMap: Record<string, CollaborativeWriting>,
  year: string,
): Session[] {
  return talksResponse.results.map((talk) => {
    const sessionLanguage = talk.answers.find((answer) => answer.question.id === QUESTION_ID_SESSION_LANGUAGE)?.options[0]?.answer.en
    const sessionTypeId = sessionTypes.find((type) => talk.track?.['zh-tw'] === type.zh.name || talk.track?.en === type.en.name)?.id ?? sessionTypes.find((type) => type.zh.name === 'main')?.id ?? ''

    return {
      id: talk.code,
      type: sessionTypeId,
      room: talk.slot.room?.en || talk.slot.room?.['zh-tw'] || '',
      start: talk.slot.start,
      end: talk.slot.end,
      language: sessionLanguage || '',
      zh: {
        title: talk.title,
        description: getAnswerFromQuestions(talk, QUESTION_ID_SESSION_ZH_DESC, talk.abstract || '') || '',
      },
      en: {
        title: getAnswerFromQuestions(talk, QUESTION_ID_SESSION_EN_TITLE, talk.title) || '',
        description: getAnswerFromQuestions(talk, QUESTION_ID_SESSION_EN_DESC, talk.abstract || '') || '',
      },
      speakers: talk.speakers.map((speaker) => speaker.code),
      tags: Array.from(getSessionTags(talk)),
      co_write: collaborativeWritingMap[talk.code]?.URL || null,
      qa: getAnswerFromQuestions(talk, QUESTION_ID_SESSION_QA, null),
      slide: getAnswerFromQuestions(talk, QUESTION_ID_SESSION_SLIDE, null),
      record: getAnswerFromQuestions(talk, QUESTION_ID_SESSION_RECORD, null),
      uri: `https://coscup.org/${year}/session/${talk.code}`,
    }
  })
}

interface GenerateResultParams {
  talksResponse: PretalxResponse<PretalxTalk>
  roomsResponse: PretalxResponse<PretalxRoom>
  speakersResponse: PretalxResponse<PretalxSpeaker>
  collaborativeWritingMap: Record<string, CollaborativeWriting>
  year: string
}

export function generateResult({
  talksResponse,
  roomsResponse,
  speakersResponse,
  collaborativeWritingMap,
  year,
}: GenerateResultParams): Sessions {
  const processedRooms = processRooms(roomsResponse)
  const processedSpeakers = processSpeakers(speakersResponse)
  const processedSessionTypes = processSessionTypes(talksResponse)
  const processedSessions = processSessions(talksResponse, processedSessionTypes, collaborativeWritingMap, year)

  return {
    sessions: processedSessions,
    speakers: processedSpeakers,
    session_types: processedSessionTypes,
    rooms: processedRooms,
    tags: AVAILABLE_TAGS,
  }
}
