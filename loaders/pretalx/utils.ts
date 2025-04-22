import type { PretalxSpeaker, PretalxTalk } from './pretalx'
import { createHash } from 'node:crypto'

export function filterUnknownCharacters(text: string): string {
  return text.replace(/\u2028/g, '\n')
}

export function getAnswerFromQuestions(
  data: PretalxTalk | PretalxSpeaker,
  questionId: number,
  fallbackValue: string | null,
): string | null {
  const answer = data.answers.find((answer) => answer.question.id === questionId)?.answer
  return (!answer || answer === '-') ? fallbackValue : answer
}

export function generateMd5Hash(input: string): string {
  if (!input) {
    return ''
  }

  return createHash('md5').update(input).digest('hex')
}

export function generateMd5Base64Hash(input: string): string {
  return createHash('md5').update(input).digest('base64url')
}
