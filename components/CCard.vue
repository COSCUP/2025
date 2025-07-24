<script setup lang="ts">
import { generateColorPalette } from '#utils/color.ts'
import { formatTimeRange } from '#utils/format-time.ts'
import { computed } from 'vue'
import CTag from './CTag.vue'

import Bookmark from './Icons/Bookmark.vue'

interface Props {
  title: string
  startAt: string
  endAt: string
  speaker: string
  bookmarked?: boolean
  tagText?: string
  status?: 'default' | 'active' | 'disabled'
  heightFactor?: number
  trackColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  bookmarked: false,
  tagText: '主議程軌',
  status: 'default',
  heightFactor: 1,
  trackColor: '#7f73fe', // fallback color
})

defineEmits<{
  (e: 'bookmark'): void
}>()

const cardStyle = computed(() => ({
  height: `${150 * props.heightFactor}px`,
}))

const dynamicCardStyle = computed(() => ({
  ...cardStyle.value,
  ...generateColorPalette(props.trackColor),
}))
</script>

<template>
  <div
    :class="[
      $style.card,
      $style[`card${props.status.charAt(0).toUpperCase() + props.status.slice(1)}`],
      props.bookmarked ? $style.cardBookmarked : '',
    ]"
    :style="dynamicCardStyle"
  >
    <!-- Header with title, time and bookmark -->
    <div :class="$style.header">
      <div :class="$style.topContent">
        <div
          :class="[
            $style.title,
            props.status === 'disabled' ? $style.titleDisabled : '',
            props.bookmarked ? $style.titleBookmarked : '',
          ]"
        >
          {{ props.title }}
        </div>
        <div :class="[$style.time, props.bookmarked ? $style.timeBookmarked : '']">
          {{ formatTimeRange(startAt, endAt, false) }}
        </div>
      </div>
      <div
        :class="$style.bookmarkContainer"
        @click.prevent.stop="$emit('bookmark')"
      >
        <Bookmark
          :bookmarked="props.bookmarked"
        />
      </div>
    </div>

    <!-- Speaker -->
    <div :class="[$style.speaker, props.bookmarked ? $style.speakerBookmarked : '']">
      {{ props.speaker }}
    </div>

    <!-- Tag -->
    <div :class="$style.tagContainer">
      <CTag
        :variant="props.bookmarked ? 'bookmarked' : 'default'"
      >
        {{ props.tagText }}
      </CTag>
    </div>
  </div>
</template>

<style module>
.card {
  background-color: var(--c-bg);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2px;
  padding: 8px 6px 8px 8px;
  min-height: 120px;
}

.cardDisabled {
  background-color: color-mix(in oklch, var(--c-bg) 80%, transparent 20%);
  border: 1px dashed var(--c-border);
}

.cardDefault {
  border: 1px solid var(--c-border);
}

.cardActive {
  border: 2px solid var(--c-active-border);
  box-shadow:
    0px 10px 15px -3px rgba(0, 0, 0, 0.1),
    0px 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  flex-direction: row;
  gap: 2px;
  align-items: flex-start;
  justify-content: space-between;

  width: 100%;
}

.topContent {
  display: flex;
  flex-direction: column;
  gap: 2px;

  width: 100%;
}

.title {
  font-family: 'PingFang TC', sans-serif;
  font-weight: 600;
  color: var(--c-text);
  line-height: 1.2;
  letter-spacing: 0.42px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.time {
  font-family: 'PingFang TC', sans-serif;
  font-weight: 600;
  color: var(--c-text);
  opacity: 0.6;
  letter-spacing: 0.42px;
}

.bookmarkContainer {
  width: 24px;
  height: 24px;
}

.speaker {
  font-family: 'PingFang TC', sans-serif;
  font-weight: 400;
  color: var(--c-text);
  font-size: 0.8em;
}

.tagContainer {
  padding: 2px 0;
  margin-top: auto;
  width: 100%;
}

.titleDisabled {
  opacity: 0.6;
}

/* Bookmarked theme styles */
.cardBookmarked {
  background-color: var(--c-bm-bg);
}

.cardBookmarked.cardDefault {
  border-color: var(--c-bm-border);
}

.cardBookmarked.cardActive {
  background-color: var(--c-bm-bg);
  border-color: var(--c-bm-active-border);
}

.cardBookmarked.cardDisabled {
  background-color: color-mix(in oklch, var(--c-bm-bg) 80%, transparent 20%);
  border: 1px dashed var(--c-bm-border);
}

.titleBookmarked {
  color: var(--c-bm-text);
}

.timeBookmarked {
  color: var(--c-bm-text);
}

.speakerBookmarked {
  color: var(--c-bm-text);
}
</style>
