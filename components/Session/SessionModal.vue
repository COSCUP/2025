<script setup lang="ts">
import type { SubmissionResponse } from '#loaders/types.ts'
import type { MessageKey } from './session-messages'
import CTag from '#components/CTag.vue'
import { formatTimeRange } from '#utils/format-time.ts'
import { markdownToHtml } from '#utils/markdown.ts'
import { breakpointsTailwind, computedAsync, useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
  session: SubmissionResponse | null
  messages: Record<MessageKey, string>
}>()

defineEmits<{
  (e: 'close'): void
}>()

// Reactive state for mobile view
const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greater('sm')

const advertisement = computedAsync(async () => {
  const { getAdvertisement } = await import('./advertisement')
  // Only retrieve advertisement when the modal is open (session is available)
  return props.session ? getAdvertisement() : null
}, null)

const sessionTime = computed(() => {
  const startDateString = props.session?.start
  const endDateString = props.session?.end

  if (!startDateString || !endDateString) return props.messages.unknown

  return formatTimeRange(startDateString, endDateString, true)
})
</script>

<template>
  <div
    v-if="session"
    class="modal-overlay-wrapper"
  >
    <div
      class="modal-overlay"
      @click="$emit('close')"
    />
    <aside
      aria-modal="true"
      class="modal-panel"
      role="dialog"
    >
      <article class="dialog-content">
        <main class="content-col">
          <div class="dialog-header">
            <div class="header-spacer" />
            <CButton
              v-if="isDesktop"
              class="dialog-close"
              variant="secondary"
              @click="$emit('close')"
            >
              <IconPhX />
            </CButton>
            <CButton
              v-else
              class="dialog-close-mobile"
              variant="primary"
              @click="$emit('close')"
            >
              <template #icon>
                <IconPhX />
              </template>
              {{ messages.close }}
            </CButton>
          </div>
          <div class="main-content">
            <h1
              v-if="session"
              class="dialog-title"
            >
              {{ session.title }}
            </h1>

            <section
              v-if="session"
              class="dialog-description"
            >
              <section class="session-details">
                <div class="session-detail-row">
                  <div class="session-detail-label">
                    <IconPhClock />
                    {{ messages.time }}
                  </div>
                  {{ sessionTime }}
                </div>
                <div class="session-detail-row">
                  <div class="session-detail-label">
                    <IconPhUser />
                    {{ messages.speaker }}
                  </div>
                  {{ session.speakers.map(speaker => speaker.name).join(', ') }}
                </div>
                <div class="session-detail-row">
                  <div class="session-detail-label">
                    <IconPhMapPin />
                    {{ messages.room }}
                  </div>
                  {{ session.room.name }}
                </div>
                <div
                  v-if="session.co_write"
                  class="session-detail-row"
                >
                  <div class="session-detail-label">
                    <IconPhFileText />
                    {{ messages.collaborativeNotes }}
                  </div>
                  <a :href="session.co_write">{{ session.co_write }}</a>
                </div>
              </section>

              <section class="session-tags">
                <CTag variant="secondary">
                  {{ session.language }}
                </CTag>
                <CTag variant="secondary">
                  {{ session.difficulty }}
                </CTag>
              </section>

              <section class="session-tags">
                <CTag variant="primary">
                  {{ session.track.name }}
                </CTag>
              </section>

              <hr class="separator">

              <section class="session-description">
                <h2>{{ messages.abstract }}</h2>
                <div
                  v-if="session.abstract"
                  class="content-container"
                  v-html="markdownToHtml(session.abstract, 'zh-tw')"
                />
              </section>

              <ClientOnly>
                <section :class="$style['cool-sponsor-horizontal-area']">
                  <a
                    v-if="advertisement"
                    :href="advertisement.link"
                  >
                    <img
                      :alt="`橫式廣告 – ${advertisement.id}`"
                      :src="advertisement.horizontal"
                    >
                  </a>
                </section>
              </ClientOnly>

              <section
                v-if="session.speakers.length > 0"
                class="session-description"
              >
                <h2>{{ messages.aboutSpeaker }}</h2>
                <template
                  v-for="speaker in session.speakers"
                  :key="speaker.code"
                >
                  <img
                    :alt="speaker.name"
                    class="speaker-avatar"
                    height="80"
                    :src="speaker.avatar"
                    width="80"
                  >
                  <p class="speaker-name">
                    {{ speaker.name }}
                  </p>
                  <div
                    v-if="speaker.bio"
                    class="speaker-bio content-container"
                    v-html="markdownToHtml(speaker.bio, 'zh-tw')"
                  />
                </template>
              </section>
            </section>
          </div>
        </main>
        <ClientOnly>
          <aside>
            <div :class="$style['cool-sponsor-vertical-area']">
              <a
                v-if="advertisement"
                :href="advertisement.link"
              >
                <img
                  :alt="`直式廣告 – ${advertisement.id}`"
                  :src="advertisement.vertical"
                >
              </a>
            </div>
          </aside>
        </ClientOnly>
      </article>
    </aside>
  </div>
</template>

<style>
.content-container > p {
  margin-bottom: 10px;
}

.content-container a {
  color: var(--color-primary-400);
  text-decoration: underline;
}
</style>

<style lang="css" module>
.cool-sponsor-vertical-area {
  display: none;
}

.cool-sponsor-horizontal-area {
  display: block;
  width: 100%;
}

@media (min-width: 500px) {
  .cool-sponsor-vertical-area {
    display: block;
    width: 100%;
  }

  .cool-sponsor-horizontal-area {
    display: none;
  }
}
</style>

<style scoped>
/* #region component */
.dialog {
  /* make the dialog show on top of other elements */
  z-index: 1000;

  &::backdrop {
    background: rgba(0, 0, 0, 0.8);
  }

  &[open],
  &[open]::backdrop {
    animation: fade-in 0.2s forwards;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.dialog-content {
  display: flex;
  position: relative;
  height: 100dvh;
  width: 100%;
  background: var(--background, #fff);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  top: 0;
  bottom: 0;
  right: 0;
  max-width: 100%;
  border: none;
  border-left: 1px solid #e5e7eb;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  overflow-y: auto;
  padding: 0;
  margin: 0;
}

@media (min-width: 500px) {
  .dialog {
    width: clamp(500px, 75vw, 800px);
  }
}

.content-col {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-width: 0;
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  width: 100%;
  padding: 1rem 1.5rem 0 1.5rem;
  box-sizing: border-box;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  flex: 1 1 0%;
  min-width: 0;
}

.dialog-close {
  position: absolute;
  right: auto;
  top: auto;
}

.dialog-close-mobile {
  position: absolute;
  bottom: 1rem;
  width: 90% !important;
}

@media (min-width: 900px) {
  .dialog-content {
    flex-direction: row;
  }
}

/* #endregion component */

.dialog-title {
  font-size: var(--text-2xl);
  line-height: 32px;
  font-weight: 600;
  color: var(--color-primary-400);
  margin-bottom: 12px;
}

.dialog-description {
  display: flex;
  flex-direction: column;
  gap: 12px;

  > .session-details {
    display: flex;
    flex-direction: column;
    gap: 12px;

    > .session-detail-row {
      display: flex;
      gap: 12px;

      font-size: var(--text-sm);
      font-weight: 400;

      > .session-detail-label {
        display: flex;
        align-items: center;
        gap: 2px;
        color: var(--color-gray-400);
      }

      > a {
        text-decoration: underline !important;
      }
    }
  }

  > .session-tags {
    display: flex;
    gap: 12px;
  }

  > .separator {
    width: 100%;
    border: none;
    border-top: 1px solid var(--color-gray-300);
    margin-block: 16px;
  }

  > .session-description {
    font-size: var(--text-sm);

    > h2 {
      font-weight: 600;
      color: var(--color-primary-400);
      margin-bottom: 10px;
    }

    > p {
      font-weight: 400;
      margin-bottom: 10px;
    }

    > .speaker-avatar {
      margin-block: 6px;
      border-radius: 50%;
      height: 80px;
      width: 80px;
      object-fit: cover;
    }

    > .speaker-name {
      font-weight: 600;
      margin-top: 6px;
    }

    > .speaker-bio {
      margin-bottom: 2rem;
    }
  }
}

.modal-overlay-wrapper {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}

.modal-panel {
  position: relative;
  z-index: 1001;
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  background: var(--background, #fff);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  right: 0;
  top: 0;
}

@media (min-width: 500px) {
  .modal-panel {
    width: clamp(500px, 75vw, 800px);
    max-width: 100vw;
  }
}
</style>
