<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'bookmarked' | 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const tagStyle = computed(() => {
  switch (props.variant) {
    case 'bookmarked':
      return {
        backgroundColor: 'var(--c-bm-tag-bg)',
        color: 'var(--c-bm-tag-text)',
      }
    case 'primary':
      return {
        backgroundColor: 'var(--c-tag-bg)',
        color: 'var(--c-tag-text)',
      }
    case 'secondary':
      return {
        backgroundColor: 'var(--c-tag-bg)',
        color: 'var(--c-tag-text)',
      }
    default:
      return {
        backgroundColor: 'var(--c-tag-bg)',
        color: 'var(--c-tag-text)',
      }
  }
})
</script>

<template>
  <span
    :class="$style.tag"
    :style="tagStyle"
  >
    <slot />
  </span>
</template>

<style module>
.tag {
  padding: 2px calc(6px + 0.5em);
  border-radius: 999rem;
  font-size: 0.85em;
  font-weight: 400;
  transition: background-color 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: min-content;
  max-width: 100%;
  display: block;
}
</style>
