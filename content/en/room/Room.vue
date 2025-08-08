<script setup>
import { data } from '#loaders/room.data'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Status from './Status.vue'

const { sessions, rooms, session_types } = data
const testMode = ref(false)
const currentTime = ref(new Date())
const timer = ref(null)
const roomInterval = ref(null)
const crowd = ref([])
const roomsStatus = ref({})

const roomStatus = computed(() => {
  return Object.keys(rooms).map((room) => {
    const roomSessions = sessions[room]
    const now = currentTime.value

    const currentSession = roomSessions.find((session) => {
      const start = new Date(session.start)
      const end = new Date(session.end)
      return start <= now && now <= end
    })

    if (currentSession) {
      return {
        room,
        course: {
          title: currentSession.en.title,
          start: currentSession.start,
          end: currentSession.end,
          uri: currentSession.uri,
        },
        type: currentSession.type,
      }
    }

    // no currentSession => find nextSession

    const nextSession = roomSessions.find((session) => new Date(session.start) > now)
    if (nextSession) {
      const nextSessionStart = new Date(nextSession.start)
      if (nextSessionStart.getDate() === now.getDate()) {
        return {
          room,
          course: `Next session ${nextSession.en.title} will start at ${formatTime(nextSession.start, false)}`,
          uri: nextSession.uri,
          type: nextSession.type,
        }
      }
    }

    // no nextSession
    return {
      room,
      course: null,
      type: '',
    }
  })
})

onMounted(() => {
  const query = new URLSearchParams(window.location.search)
  testMode.value = query.get('test') === 'true'
  startClock()
  crowd.value = Object.keys(rooms).reduce((acc, item) => {
    acc[item] = Math.round(Math.random() * 100)
    return acc
  }, {})

  roomInterval.value = setInterval(fetchRoomStatus, 10 * 1000)
})

onUnmounted(() => {
  if (timer.value !== null) {
    clearInterval(timer.value)
  }

  if (roomInterval.value !== null) {
    clearInterval(roomInterval.value)
  }
})

function fetchRoomStatus() {
  fetch('https://room.coscup.org')
    .then((res) => {
      res.json().then((data) => {
        roomsStatus.value = data
      })
    })
}

function startClock() {
  if (testMode.value) {
    currentTime.value = new Date('2025-08-09T08:50:00')

    timer.value = setInterval(() => {
      currentTime.value = new Date(currentTime.value.getTime() + 60 * 100)
    }, 100)
  } else {
    timer.value = setInterval(() => {
      currentTime.value = new Date()
    }, 10 * 1000)
  }
}

function formatTime(time, date = true) {
  const d = new Date(time)
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const DD = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayName = weekdays[d.getDay()]

  if (date) {
    return `${MM}/${DD}(${dayName}) ${hh}:${mm}`
  } else {
    return `${hh}:${mm}`
  }
}

function interpolateColor(color1, color2, factor) {
  const r = Math.round(color1.r + factor * (color2.r - color1.r))
  const g = Math.round(color1.g + factor * (color2.g - color1.g))
  const b = Math.round(color1.b + factor * (color2.b - color1.b))
  const a = color1.a + factor * (color2.a - color1.a)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function getCssVar(name, soft = true) {
  if (soft) {
    const rgba = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    const parts = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)

    if (parts === null) {
      return {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      }
    }

    return {
      r: Number(parts[1]),
      g: Number(parts[2]),
      b: Number(parts[3]),
      a: Number(parts[4]),
    }
  } else {
    const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return {
      r: Number.parseInt(result[1], 16),
      g: Number.parseInt(result[2], 16),
      b: Number.parseInt(result[3], 16),
      a: 1,
    }
  }
}

function getColor(type, value, soft = true) {
  if (typeof type === 'string' || type === null) {
    return 'transparent'
  }

  let yellow, red, green

  if (soft) {
    yellow = getCssVar('--vp-c-warning-soft')
    red = getCssVar('--vp-c-danger-soft')
    green = getCssVar('--vp-c-success-soft')
  } else {
    yellow = getCssVar('--vp-c-warning-3', false)
    red = getCssVar('--vp-c-danger-3', false)
    green = getCssVar('--vp-c-success-3', false)
  }

  if (value <= 50) {
    return interpolateColor(green, yellow, value / 50)
  } else {
    return interpolateColor(yellow, red, (value - 50) / 50)
  }
}

function getStatusText(room) {
  return roomsStatus.value[room] ?? ''
}
</script>

<template>
  <div>
    <p>Current Time: {{ formatTime(currentTime) }}</p>
    <div class="grid-table">
      <div class="header">
        Room
      </div>
      <div class="header">
        Track
      </div>
      <!-- <div class="header">
        Status
      </div> -->
      <div class="header">
        Session
      </div>

      <template
        v-for="session in roomStatus"
        :key="session.room"
      >
        <div
          :class="(session.course === null || typeof session.course === 'string') ? 'cell' : 'cell tag-padding'"
          :style="{ '--tag-color': getColor(session.course, crowd[session.room], false) }"
          :tag-text="getStatusText(session.course, crowd[session.room])"
        >
          {{ rooms[session.room].en }}
        </div>
        <div class="cell">
          {{ session.type ? session_types[session.type].en : session.type }}
        </div>
        <!-- <div
          class="cell"
          :style="{ 'background-color': `${getColor(session.course, crowd[session.room])}` }"
        >
          {{ getStatusText(rooms[session.room].en) }}
        </div> -->
        <div class="cell session-room">
          <span
            v-if="session.course === null"
            class="empty-room"
          > All sessions today have ended </span>
          <span
            v-else-if="typeof session.course === 'string'"
            class="empty-room"
          ><a :href="session.uri">{{ session.course }}</a></span>
          <Status
            v-else
            :current-time="currentTime"
            :data="session.course"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.grid-table {
  display: grid;
  grid-template-columns: 6em 20% auto;
  border-collapse: collapse;
  overflow-wrap: break-word;
}

.header {
  font-weight: bold;
  text-align: center;
  background-color: var(--vp-c-default-2);
  padding: 8px;
  border: 1px solid var(--vp-c-default-1);
}

.cell {
  padding: 8px;
  border: 1px solid var(--vp-c-default-1);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.session-room {
  padding: 0;
  display: flex;
  align-items: stretch;
}

.session-room > * {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.empty-room {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 8px;
}

a {
  text-decoration: none;
  color: var(--vp-custom-block-tip-text);
}

@media (max-width: 600px) {
  .grid-table {
    grid-template-columns: 6em auto;
  }
  .cell:nth-child(4n + 2),
  .cell:nth-child(4n + 3),
  .header:nth-child(4n + 2),
  .header:nth-child(4n + 3) {
    display: none;
  }
  .cell:nth-child(4n + 1)::before {
    content: attr(tag-text);
    position: absolute;
    bottom: 0.6em;
    width: 4em;
    background-color: var(--tag-color);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    color: white;
    white-space: nowrap;
  }
  .tag-padding {
    box-sizing: border-box;
    padding-bottom: 35px;
  }
}
</style>
