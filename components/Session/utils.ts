import type { SubmissionResponse } from '#loaders/types.ts'

export function isPrimeSession(session: SubmissionResponse) {
  return session.title.includes('[Prime Session]')
}
