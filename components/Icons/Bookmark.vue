<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  bookmarked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bookmarked: false,
})

const dynamicStyle = computed(() => {
  if (props.bookmarked) {
    return {
      '--bookmark-fill': 'var(--c-bm-icon-bg)',
      '--bookmark-hover-fill': 'var(--c-bm-icon-hover-bg)',
    }
  }
  return {
    '--bookmark-fill': 'var(--c-icon-text)',
    '--bookmark-hover-fill': 'var(--c-icon-hover-text)',
    '--bookmark-hover-bg': 'var(--c-icon-hover-bg)',
  }
})
</script>

<template>
  <svg
    class="bookmark-icon"
    :class="[{ bookmarked }]"
    fill="none"
    height="24"
    :style="dynamicStyle"
    viewBox="0 0 25 25"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Default state paths -->
    <template v-if="!bookmarked">
      <!-- Hover fill (hidden by default, shown on hover) -->
      <path
        class="bookmark-hover-fill"
        d="M18.1562 7.36914V21.3691L12.1562 17.3691L6.15625 21.3691V7.36914C6.15625 6.30827 6.57768 5.29086 7.32782 4.54071C8.07797 3.79057 9.09538 3.36914 10.1562 3.36914H14.1562C15.2171 3.36914 16.2345 3.79057 16.9847 4.54071C17.7348 5.29086 18.1562 6.30827 18.1562 7.36914Z"
        fill="var(--bookmark-hover-bg)"
        opacity="0.5"
      />
      <!-- Default stroke -->
      <path
        d="M17.4062 7.36914C17.4062 6.50719 17.0636 5.68078 16.4541 5.07129C15.8446 4.4618 15.0182 4.11914 14.1562 4.11914H10.1562C9.2943 4.11914 8.46789 4.4618 7.8584 5.07129C7.24891 5.68078 6.90625 6.50719 6.90625 7.36914V19.9678L11.7402 16.7451L11.8379 16.6904C12.073 16.5801 12.3518 16.5981 12.5723 16.7451L17.4062 19.9678V7.36914ZM18.9062 21.3691C18.9062 21.6457 18.7536 21.8998 18.5098 22.0303C18.2659 22.1606 17.9703 22.1465 17.7402 21.9932L12.1562 18.2705L6.57227 21.9932C6.3422 22.1465 6.04656 22.1606 5.80273 22.0303C5.55887 21.8998 5.40625 21.6457 5.40625 21.3691V7.36914C5.40625 6.10936 5.90705 4.90154 6.79785 4.01074C7.68865 3.11994 8.89647 2.61914 10.1562 2.61914H14.1562C15.416 2.61914 16.6239 3.11994 17.5146 4.01074C18.4054 4.90154 18.9062 6.10936 18.9062 7.36914V21.3691Z"
        fill="var(--bookmark-fill)"
      />
    </template>

    <!-- Bookmarked state path -->
    <template v-else>
      <path
        d="M14.6562 2.36914C15.9823 2.36914 17.2541 2.89592 18.1918 3.83361C19.1295 4.77129 19.6562 6.04306 19.6562 7.36914V21.3691C19.6563 21.5502 19.6072 21.7278 19.5141 21.8832C19.4211 22.0385 19.2876 22.1656 19.128 22.251C18.9684 22.3364 18.7886 22.3769 18.6077 22.3681C18.4269 22.3593 18.2519 22.3016 18.1012 22.2011L12.6562 18.5711L7.21225 22.2011C7.06955 22.2966 6.90465 22.3538 6.73345 22.3671C6.56225 22.3804 6.39051 22.3494 6.23478 22.277C6.07905 22.2047 5.94457 22.0934 5.84429 21.9541C5.74401 21.8147 5.68132 21.6518 5.66225 21.4811L5.65625 21.3691V7.36914C5.65625 6.04306 6.18303 4.77129 7.12072 3.83361C8.0584 2.89592 9.33017 2.36914 10.6562 2.36914H14.6562Z"
        fill="var(--bookmark-fill)"
      />
    </template>
  </svg>
</template>

<style scoped>
.bookmark-icon {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.bookmark-hover-fill {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.bookmark-icon:hover .bookmark-hover-fill {
  opacity: 1;
}

.bookmark-icon:not(.bookmarked):hover path:not(.bookmark-hover-fill) {
  fill: var(--bookmark-hover-fill);
}

.bookmark-icon.bookmarked:hover path {
  fill: var(--bookmark-hover-fill);
}
</style>
