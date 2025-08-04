<script setup lang="ts">
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
  isPrime?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bookmarked: false,
  tagText: '主議程軌',
  status: 'default',
  isPrime: false,
})

defineEmits<{
  (e: 'bookmark'): void
}>()

const tagVariant = computed(() => {
  if (props.isPrime) {
    return props.bookmarked ? 'primeActive' : 'prime'
  }

  return props.bookmarked ? 'active' : 'secondary'
})
</script>

<template>
  <div
    :class="[
      $style.card,
      $style[`card${props.status.charAt(0).toUpperCase() + props.status.slice(1)}`],
      props.isPrime ? $style.cardPrime : '',
      props.bookmarked ? $style.cardBookmarked : '',
    ]"
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
        <Bookmark :bookmarked="props.bookmarked" />
      </div>
    </div>

    <!-- Speaker -->
    <div :class="[$style.speaker, props.bookmarked ? $style.speakerBookmarked : '']">
      {{ props.speaker }}
    </div>

    <!-- Tag -->
    <div :class="$style.tagContainer">
      <CTag
        :variant="tagVariant"
      >
        {{ props.tagText }}
      </CTag>
    </div>
  </div>
</template>

<style module>
.card {
  background-color: #e5e3ff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2px;
  padding: 8px 6px 8px 8px;
  min-height: 120px;
}

.cardDisabled {
  background-color: rgba(229, 227, 255, 0.8);
  border: 1px dashed #998ffe;
}

.cardDefault {
  border: 1px solid #ccc7ff;
}

.cardActive {
  border: 2px solid #7f73fe;
  box-shadow:
    0px 10px 15px -3px rgba(0, 0, 0, 0.1),
    0px 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.cardPrime {
  border: 2px solid #ffd700;
  outline: 1px solid #ccc7ff;
  padding: 12px 6px 12px 8px;
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
  color: #4c4598;
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
  color: #4c4598;
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
  color: #4c4598;
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
  background-color: #fce7f3;
}

.cardBookmarked.cardDefault {
  border-color: #fccee8;
}

.cardBookmarked.cardActive {
  background-color: #fdf2f8;
  border-color: #fb64b6;
}

.cardBookmarked.cardDisabled {
  background-color: #fdf2f8;
  border-color: #fda5d5;
}

.titleBookmarked {
  color: #e60076;
}

.timeBookmarked {
  color: #e60076;
}

.speakerBookmarked {
  color: #e60076;
}
</style>
