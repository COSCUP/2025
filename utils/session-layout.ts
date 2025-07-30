/**
 * The layout engine of sessions.
 */

import type { SubmissionResponse } from '#loaders/types.ts'

/**
 * The time configuration of the schedule.
 */
export const TIME_SLOT_HEIGHT = 400 // pixels per hour
/**
 * The start hour of the schedule.
 */
export const START_HOUR = 9 // 9AM
/**
 * The end hour of the schedule.
 */
export const END_HOUR = 17 // 5PM

interface SessionScheduleLayoutInfo {
  startTime: number
  duration: number
  topPosition: number
  height: number
}

export class SessionScheduleLayout {
  #layout: Map<string, SessionScheduleLayoutInfo>

  constructor(submissions: SubmissionResponse[]) {
    this.#layout = this.#createScheduleLayout(submissions)
  }

  #createScheduleLayout(submissions: SubmissionResponse[]): Map<string, SessionScheduleLayoutInfo> {
    const schedule = new Map<string, SessionScheduleLayoutInfo>()

    submissions.forEach((submission) => {
      if (!submission.room || !submission.start || !submission.end) return

      const start = new Date(submission.start)
      const end = new Date(submission.end)

      // Calculate startTime as hour + minute/60
      const startTime = start.getUTCHours() + 8 + start.getUTCMinutes() / 60
      const endTime = end.getUTCHours() + 8 + end.getUTCMinutes() / 60
      const duration = endTime - startTime

      schedule.set(submission.code, {
        startTime,
        duration,
        topPosition: (startTime - START_HOUR) * TIME_SLOT_HEIGHT,
        height: duration * TIME_SLOT_HEIGHT,
      })
    })

    return schedule
  }

  getSessionStyle(sessionCode: string) {
    const scheduleInfo = this.#layout.get(sessionCode)
    if (!scheduleInfo) return { top: '0px', height: '120px' }

    return {
      top: `${scheduleInfo.topPosition}px`,
      height: `${scheduleInfo.height}px`,
    }
  }

  getHeightFactor(sessionCode: string) {
    const scheduleInfo = this.#layout.get(sessionCode)
    if (!scheduleInfo) return 1

    return Math.max(1, Math.ceil(scheduleInfo.duration * 2)) // 30 min increments
  }
}
