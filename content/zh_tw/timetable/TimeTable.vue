<script setup lang="ts">
import type { Session } from '#loaders/session.data'
import { computed, ref } from 'vue'

interface Props {
  sessions: Session[]
}

const props = defineProps<Props>()

type Language = 'zh' | 'en'
const currentLang = ref<Language>('zh')
function toggleLang() {
  currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
}

const currentDay = ref(1)
const timezone = ref('Asia/Taipei')

// Group sessions by day and time slot
const sessionsByDayAndRoom = computed(() => {
  const days = new Map<number, Map<string, Session[]>>()

  props.sessions.forEach((session) => {
    const date = new Date(session.start)
    const day = date.getDate() === 3 ? 1 : 2 // August 3rd is day 1, 4th is day 2

    if (!days.has(day)) {
      days.set(day, new Map())
    }

    const dayMap = days.get(day)!
    if (!dayMap.has(session.room)) {
      dayMap.set(session.room, [])
    }

    dayMap.get(session.room)!.push(session)
  })

  return days
})

const timeSlots = computed(() => {
  const slots = new Set<string>()
  props.sessions
    .filter((session) => {
      const date = new Date(session.start)
      const day = date.getDate() === 3 ? 1 : 2
      return day === currentDay.value
    })
    .forEach((session) => slots.add(session.start))
  return Array.from(slots).sort()
})

const rooms = computed(() => {
  const roomSet = new Set<string>()
  props.sessions.forEach((session) => roomSet.add(session.room))
  return Array.from(roomSet).sort()
})

function formatTime(timeString: string) {
  return new Date(timeString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone.value,
  })
}

function getSessionsForTimeSlot(day: number, room: string, startTime: string) {
  const dayMap = sessionsByDayAndRoom.value.get(day)
  if (!dayMap) return []

  const roomSessions = dayMap.get(room) || []
  return roomSessions.filter((session) => session.start === startTime)
}

function getDayDate(day: number) {
  return `2024/8/${day === 1 ? '3' : '4'}` // August 3rd is day 1
}

const roomCount = computed(() => rooms.value.length)
</script>

<template>
  <div
    class="timetable-container"
    :style="{ '--room-count': roomCount }"
  >
    <div class="timetable-header">
      <h1>COSCUP 2025 Timetable</h1>

      <div class="controls">
        <div class="day-selector">
          <button
            v-for="day in [1, 2]"
            :key="day"
            :class="{ active: currentDay === day }"
            @click="currentDay = day"
          >
            <div class="day-label">
              Day {{ day }}
            </div>
            <div class="day-date">
              {{ getDayDate(day) }}
            </div>
          </button>
        </div>

        <div class="timezone-selector">
          <span>時區：</span>
          <select v-model="timezone">
            <option value="Asia/Taipei">
              Asia/Taipei
            </option>
          </select>
        </div>

        <button
          class="lang-toggle"
          @click="toggleLang"
        >
          {{ currentLang === 'zh' ? 'Switch to English' : '切換至中文' }}
        </button>
      </div>
    </div>

    <div class="timetable-grid">
      <table>
        <thead>
          <tr>
            <th class="room-header">
              Room
            </th>
            <th
              v-for="room in rooms"
              :key="room"
              class="room-cell"
            >
              {{ room }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="timeSlot in timeSlots"
            :key="timeSlot"
          >
            <td class="time-cell">
              {{ formatTime(timeSlot) }}
            </td>
            <td
              v-for="room in rooms"
              :key="room"
              class="session-cell"
            >
              <template v-if="getSessionsForTimeSlot(currentDay, room, timeSlot).length > 0">
                <div
                  v-for="session in getSessionsForTimeSlot(currentDay, room, timeSlot)"
                  :key="session.id"
                  class="session-card"
                  :class="{ 'has-tags': session.tags.length > 0 }"
                >
                  <div
                    v-if="session.type"
                    class="session-type"
                  >
                    {{ session.type }}
                  </div>
                  <h3>{{ session[currentLang].title }}</h3>
                  <p class="session-description">
                    {{ session[currentLang].description }}
                  </p>
                  <div class="session-meta">
                    <span class="session-language">{{ session.language }}</span>
                    <div class="session-tags">
                      <span
                        v-for="tag in session.tags"
                        :key="tag"
                        class="tag"
                      >
                        {{ tag }}
                      </span>
                    </div>
                    <div
                      v-if="session.speakers.length"
                      class="session-speakers"
                    >
                      by {{ session.speakers.join(', ') }}
                    </div>
                  </div>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.timetable-container {
  width: 100vw;
  min-height: calc(100vh - var(--vp-nav-height));
  margin: 0;
  padding: 0;
  background: var(--vp-c-bg);
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.timetable-header {
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.timetable-header h1 {
  font-size: 2.5rem;
  margin: 0 0 1.5rem;
  color: var(--vp-c-text-1);
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.day-selector {
  display: flex;
  gap: 0.5rem;
}

.day-selector button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-mute);
  cursor: pointer;
  transition: all 0.2s;
}

.day-selector button.active {
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand);
}

.day-label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.day-date {
  font-size: 0.9em;
  opacity: 0.8;
}

.timezone-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timezone-selector select {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.lang-toggle {
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand);
  background: transparent;
  color: var(--vp-c-brand);
  cursor: pointer;
  transition: all 0.2s;
}

.lang-toggle:hover {
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
}

.timetable-grid {
  overflow: auto;
  height: calc(100vh - var(--vp-nav-height) - 100px);
  padding: 1rem;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--vp-c-bg);
}

th,
td {
  border: 1px solid var(--vp-c-divider);
  padding: 1rem;
}

.room-header {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1;
  min-width: 100px;
}

.room-cell {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
  text-align: center;
  min-width: 300px;
}

.time-cell {
  background: var(--vp-c-bg-soft);
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  position: sticky;
  left: 0;
  z-index: 1;
}

.session-cell {
  vertical-align: top;
  min-height: 120px;
  background: var(--vp-c-bg-mute);
}

.session-card {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 1rem;
  height: 100%;
  transition: all 0.2s;
  border: 1px solid var(--vp-c-divider);
}

.session-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.session-type {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
  font-size: 0.8em;
  margin-bottom: 0.5rem;
}

.session-card h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.session-description {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.session-meta {
  font-size: 0.8em;
  color: var(--vp-c-text-2);
}

.session-language {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-bg-mute);
  margin-right: 0.5rem;
}

.session-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0.5rem 0;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
}

.session-speakers {
  margin-top: 0.5rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .timetable-header {
    padding: 1rem;
  }

  .timetable-header h1 {
    font-size: 1.8rem;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .timezone-selector {
    flex-direction: column;
  }

  .session-card {
    padding: 0.75rem;
  }

  .session-description {
    display: none;
  }
}
</style>
