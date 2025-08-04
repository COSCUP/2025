<script setup lang="ts">
import type { SubmissionResponse } from '#loaders/types.ts'
import type { Serializer } from '@vueuse/core'
import type { MessageKey } from './session-messages.ts'
import CCard from '#/components/CCard.vue'
import CMenuBar from '#/components/CMenuBar.vue'
import { conference } from '#data/conference'
import { END_HOUR, SessionScheduleLayout, START_HOUR, TIME_SLOT_HEIGHT } from '#utils/session-layout.ts'
import { validateValue } from '#utils/validate-value.ts'
import { breakpointsTailwind, useBreakpoints, useLocalStorage, useSessionStorage } from '@vueuse/core'
import { useRouter } from 'vitepress'
import { computed, defineAsyncComponent, h, nextTick, onMounted, ref } from 'vue'
import SessionDateTab from './SessionDateTab.vue'
import { isPrimeSession } from './utils.ts'

const props = defineProps<{
  rooms: { id: number, name: string }[]
  submissions: SubmissionResponse[]
  openedSession: SubmissionResponse | null
  messages: Record<MessageKey, string>
}>()

const SessionFilterPopover = defineAsyncComponent({
  loader: () => import('./SessionFilterPopover.vue'),
  delay: 0,
})

const iconPlaceholder = h('div', { style: { width: '1.2em', height: '1.2em' } }, '')

const IconPhBookmarkSimple = defineAsyncComponent({
  loader: () => import('~icons/ph/bookmark-simple'),
  loadingComponent: iconPlaceholder,
  delay: 0,
})
const IconPhUsersThree = defineAsyncComponent({
  loader: () => import('~icons/ph/users-three'),
  loadingComponent: iconPlaceholder,
  delay: 0,
})

// Reactive state for mobile view
const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greater('sm')

const setSerializer: Serializer<Set<string>> = {
  read: (value) => {
    try {
      return new Set(JSON.parse(value))
    } catch {
      return new Set<string>()
    }
  },
  write: (value) => JSON.stringify(Array.from(value)),
}

// Bookmarked sessions state
const bookmarkedSessions = useLocalStorage<Set<string>>('bookmarked-sessions', new Set(), {
  serializer: setSerializer,
})

const selectedCommunities = useLocalStorage<Set<string>>('selected-communities', new Set(), {
  serializer: setSerializer,
})

const selectedTags = useLocalStorage<Set<string>>('selected-tags', new Set(), {
  serializer: setSerializer,
})

const communities = computed(() => {
  const trackMap = new Map<string, string>()

  props.submissions.forEach(({ track }) => {
    if (track?.name) {
      trackMap.set(track.id.toString(), track.name)
    }
  })

  return Array.from(trackMap.entries()).map(([id, label]) => ({ id, label }))
})

const tags = computed(() => {
  const optionsMap = new Map<string, string>()

  props.submissions.forEach(({ language, difficulty }) => {
    optionsMap.set(`language:${language}`, language)
    optionsMap.set(`difficulty:${difficulty}`, difficulty)
  })

  return Array.from(optionsMap.entries())
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.id.localeCompare(b.id))
})

const communityFilterOptions = computed(() =>
  communities.value.map((option) => ({
    ...option,
    checked: selectedCommunities.value.has(option.id),
  })),
)

const tagsFilterOptions = computed(() =>
  tags.value.map((option) => ({
    ...option,
    checked: selectedTags.value.has(option.id),
  })),
)

function handleCommunityToggle(id: string, checked: boolean) {
  if (checked) {
    selectedCommunities.value.add(id)
  } else {
    selectedCommunities.value.delete(id)
  }
}

function handleTagsToggle(id: string, checked: boolean) {
  if (checked) {
    selectedTags.value.add(id)
  } else {
    selectedTags.value.delete(id)
  }
}

// View state
const selectedView = useLocalStorage<'conference' | 'bookmarked'>('selected-view', 'conference', {
  serializer: {
    read: (value) => validateValue(value, ['conference', 'bookmarked'], 'conference'),
    write: (value) => value,
  },
})

// Menu items for view toggle
const viewMenuItems = computed(() => [
  { key: 'conference', label: props.messages.conference || 'Conference' },
  { key: 'bookmarked', label: props.messages.bookmarked || 'Bookmarked' },
])

// Date selection state
const selectedDate = useLocalStorage<'start' | 'end'>('selected-date', 'start', {
  serializer: {
    read: (value) => validateValue(value, ['start', 'end'], 'start'),
    write: (value) => value,
  },
})

function updateSelectedDate(date: 'start' | 'end') {
  selectedDate.value = date
}

// Generate time slots from 9AM to 4PM
const timeSlots = computed(() => {
  const slots = []
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    const displayHour = hour <= 12 ? hour : hour - 12
    const period = hour < 12 ? 'AM' : 'PM'
    const displayTime = hour === 12 ? '12PM' : `${displayHour}${period}`
    slots.push(displayTime)
  }
  return slots
})

const layout = new SessionScheduleLayout(props.submissions)

// Get sessions for display
const displaySessions = computed(() => {
  const filteredSessions = props.submissions.filter((session) => {
    if (!session.start) return false
    const sessionDate = new Date(session.start)
    const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate())

    // Date filter
    if (selectedDate.value === 'start') {
      const startDateOnly = new Date(conference.startDate.getFullYear(), conference.startDate.getMonth(), conference.startDate.getDate())
      if (sessionDateOnly.getTime() !== startDateOnly.getTime()) return false
    } else if (selectedDate.value === 'end') {
      const endDateOnly = new Date(conference.endDate.getFullYear(), conference.endDate.getMonth(), conference.endDate.getDate())
      if (sessionDateOnly.getTime() !== endDateOnly.getTime()) return false
    } else {
      return false
    }

    // Community filter (track filter)
    if (selectedCommunities.value.size > 0) {
      if (!session.track?.id || !selectedCommunities.value.has(session.track.id.toString())) {
        return false
      }
    }

    // Tags filter (language and difficulty filter)
    if (selectedTags.value.size > 0) {
      const hasMatchingTag = selectedTags.value.has(`language:${session.language}`) || selectedTags.value.has(`difficulty:${session.difficulty}`)
      if (!hasMatchingTag) {
        return false
      }
    }

    return true
  })

  if (selectedView.value === 'bookmarked') {
    return filteredSessions.filter((session) =>
      bookmarkedSessions.value.has(session.code),
    )
  }

  return filteredSessions
})

// Toggle bookmark
function toggleBookmark(sessionCode: string) {
  if (bookmarkedSessions.value.has(sessionCode)) {
    bookmarkedSessions.value.delete(sessionCode)
  } else {
    bookmarkedSessions.value.add(sessionCode)
  }
}

// Get sessions for a specific room
function getSessionsForRoom(roomId: number | string) {
  return displaySessions.value.filter((session) =>
    session.room?.id === roomId,
  )
}

const filteredRooms = computed(() => {
  return props.rooms.filter((room) => getSessionsForRoom(room.id).length > 0)
})

const scheduleContainerRef = ref<HTMLElement | null>(null)

const router = useRouter()

// Scroll position storage
const scrollPosition = useSessionStorage<{ x: number, y: number }>('session-scroll-position', { x: 0, y: 0 })

function handleOpenSession(sessionCode: string) {
  // Capture current scroll position before navigation
  if (scheduleContainerRef.value) {
    scrollPosition.value = {
      x: scheduleContainerRef.value.scrollLeft,
      y: scheduleContainerRef.value.scrollTop,
    }
  }

  const pathname = new URL(sessionCode, location.href).pathname
  router.go(pathname)
}

// Restore scroll position on component mount (for page refreshes/direct links)
onMounted(() => {
  nextTick(() => {
    if (scheduleContainerRef.value && scrollPosition.value) {
      scheduleContainerRef.value.scrollLeft = scrollPosition.value.x
      scheduleContainerRef.value.scrollTop = scrollPosition.value.y
    }
  })
})
</script>

<template>
  <ClientOnly>
    <div
      class="schedule-page"
      :style="{
        '--room-count': filteredRooms.length,
        '--time-slot-count': timeSlots.length,
        '--time-slot-height': `${TIME_SLOT_HEIGHT}px`,
      }"
    >
      <!-- Date Selection -->
      <SessionDateTab
        v-if="isDesktop"
        :end-date="conference.endDate"
        :selected-date="selectedDate"
        :start-date="conference.startDate"
        variant="desktop"
        @update:selected-date="updateSelectedDate"
      />

      <div class="toolbar">
        <div class="toolbar-start">
          <SessionFilterPopover
            :icon="IconPhUsersThree"
            :label="props.messages.community || 'Community'"
            :options="communityFilterOptions"
            :search-placeholder="props.messages.searchCommunity"
            @toggle="handleCommunityToggle"
          />

          <SessionFilterPopover
            :icon="IconPhBookmarkSimple"
            :label="props.messages.tags || 'Tags'"
            :options="tagsFilterOptions"
            :search-placeholder="props.messages.searchTags"
            @toggle="handleTagsToggle"
          />

          <!--
        <CIconButton variant="basic">
          <IconPhMagnifyingGlass />
        </CIconButton>
        -->
        </div>

        <div class="toolbar-end">
          <CMenuBar
            v-model="selectedView"
            :items="viewMenuItems"
          />
        </div>
      </div>

      <!-- Schedule Container -->
      <div
        ref="scheduleContainerRef"
        class="schedule-container"
      >
        <!-- Room Headers -->
        <div class="room-headers">
          <div class="time-header" />
          <div
            v-for="room in filteredRooms"
            :key="room.id"
            class="room-header"
          >
            {{ room.name }}
          </div>
        </div>

        <div
          v-show="filteredRooms.length <= 0"
          class="no-sessions"
        >
          {{ props.messages.noSessions }}
        </div>

        <!-- Main Schedule Grid -->
        <div
          v-show="filteredRooms.length > 0"
          class="schedule-content"
        >
          <!-- Time Column -->
          <div class="time-column">
            <div
              v-for="timeSlot in timeSlots"
              :key="timeSlot"
              class="time-slot"
            >
              {{ timeSlot }}
            </div>
          </div>

          <!-- Sessions Area -->
          <div class="sessions-area">
            <!-- Grid Lines -->
            <div class="grid-lines">
              <div
                v-for="(_, index) in timeSlots"
                :key="`line-${index}`"
                class="grid-line"
                :style="{ top: `${index * TIME_SLOT_HEIGHT}px` }"
              />
            </div>

            <!-- Room Columns -->
            <div class="room-columns">
              <div
                v-for="(room, roomIndex) in filteredRooms"
                :key="room.id"
                class="room-column"
              >
                <!-- Vertical Separator -->
                <div
                  v-if="roomIndex > 0"
                  class="column-separator"
                />

                <!-- Session Cards for this room -->
                <div
                  v-for="session in getSessionsForRoom(room.id)"
                  :key="session.code"
                  class="session-card"
                  :style="layout.getSessionStyle(session.code)"
                  @click.prevent="handleOpenSession(session.code)"
                >
                  <CCard
                    :bookmarked="bookmarkedSessions.has(session.code)"
                    :end-at="session.end"
                    :is-prime="isPrimeSession(session)"
                    :speaker="session.speakers?.map(s => s.name).join(', ') || 'TBD'"
                    :start-at="session.start"
                    :status="openedSession?.code === session.code ? 'active' : 'default'"
                    :style="layout.getSessionStyle(session.code)"
                    :tag-text="session.track?.name || props.messages.mainTrack"
                    :title="session.title"
                    @bookmark="toggleBookmark(session.code)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SessionDateTab
        v-if="!isDesktop"
        :end-date="conference.endDate"
        :selected-date="selectedDate"
        :start-date="conference.startDate"
        variant="mobile"
        @update:selected-date="updateSelectedDate"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>
.schedule-page {
  --date-tab-height: 3rem;
  --controls-height: 5rem;
  --column-time-header: 48px;
  --column-width: 220px;

  width: 100%;
  min-width: 100%;
  padding: 18px 32px;
  height: calc(100vh - var(--vp-nav-height));
}

@media (min-width: 1024px) {
  .schedule-page {
    --column-time-header: 68px;
    --column-width: 320px;
  }
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  height: var(--controls-height);

  > .toolbar-start {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  > .toolbar-end {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.time-zone-btn {
  border: 1px solid var(--color-gray-300);
}

.schedule-container {
  border: 1px solid var(--color-gray-400);
  border-radius: 12px;
  overflow-x: auto;
  overflow-y: auto;
  width: 100%;
  height: calc(100% - var(--date-tab-height) - var(--controls-height));
  position: relative;
}

.room-headers {
  display: flex;
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  z-index: 10;
  width: max-content;
  min-width: 100%;
}

.time-header {
  width: var(--column-time-header);
  border-right: 1px solid var(--color-gray-200);
}

.room-header {
  flex: 1;
  min-width: var(--column-width);
  padding: 12px;
  text-align: center;
  font-family: 'PingFang TC', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-400);
  letter-spacing: 0.54px;
}

.schedule-content {
  display: flex;
  position: relative;
  min-height: calc(var(--time-slot-height) * var(--time-slot-count));
  min-width: calc(var(--column-width) * var(--room-count));
}

.time-column {
  width: var(--column-time-header);
  background: var(--color-gray-50);
  border-right: 1px solid var(--color-gray-200);
  position: relative;
}

.time-slot {
  width: var(--column-time-header);
  height: var(--time-slot-height);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-right: 12px;
  padding-top: 4px;
  font-family: 'PingFang TC', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-gray-400);
  position: relative;
}

.sessions-area {
  flex: 1;
  position: relative;
  min-height: calc(var(--time-slot-height) * var(--time-slot-count));
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: color-mix(in srgb, var(--color-gray-200) 50%, transparent);
}

.room-columns {
  display: flex;
  height: 100%;
  position: relative;
  z-index: 2;
  min-width: calc(var(--column-width) * var(--room-count));
}

.room-column {
  flex: 1;
  min-width: var(--column-width);
  position: relative;
  padding: 8px;
}

.column-separator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: color-mix(in srgb, var(--color-gray-200) 50%, transparent);
  z-index: 1;
}

.session-card {
  position: absolute;
  left: 8px;
  right: 8px;
  cursor: pointer;
  z-index: 3;
  transition: transform 0.2s ease;
}

a.session-card {
  text-decoration: none;
}

.session-card:hover {
  transform: translateY(-2px);
  z-index: 4;
}

.no-sessions {
  padding: 1rem;
  text-align: center;
  font-family: 'PingFang TC', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-gray-400);
  letter-spacing: 0.48px;
}
</style>
