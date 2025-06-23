<script setup lang="ts">
import type { CalendarEvent } from 'calendar-link'
import { conference } from '#data/conference'

const start = conference.startDate.toLocaleDateString()
const end = conference.endDate.toLocaleDateString()

const venueAddress = 'No. 43 Keelung Road, Section 4, Taipei 106, Taiwan'

// Supported calendar types by `calendar-link`
type CalendarType = keyof typeof import('calendar-link')

// Create an link or an ICS file to add the event to the user's calendar
async function addToCalendar(type: CalendarType) {
  const { [type]: getCalendarLink } = await import('calendar-link')

  const event: CalendarEvent = {
    title: conference.title,
    description: `<a href="${document.location.origin}">${conference.description}</a>`,
    start: conference.startDate,
    end: conference.endDate,
    allDay: true,
    location: venueAddress,
  }

  const link = getCalendarLink(event) as string

  if (type === 'ics') {
    // Set the ICS file name by creating an anchor element
    const anchor = document.createElement('a')
    anchor.href = link
    anchor.download = `${conference.title}.ics`
    anchor.click()
  } else {
    window.open(link, '_blank')
  }
}
</script>

<template>
  <section class="info custom-block">
    <div class="info-section">
      <p class="custom-block-title">
        <IconPhCalendarDots /> Date
      </p>
      <h2 class="text-brand">
        {{ start }} – {{ end }}
      </h2>
      <div class="actions">
        <VPButton
          theme="brand"
          @click="addToCalendar('google')"
        >
          <IconPhGoogleLogo /> Google Calendar
        </VPButton>
        <VPButton
          theme="brand"
          @click="addToCalendar('outlookMobile')"
        >
          <IconPhMicrosoftOutlookLogo /> Outlook
        </VPButton>
        <VPButton
          theme="brand"
          @click="addToCalendar('yahoo')"
        >
          <IconPhExclamationMark /> Yahoo
        </VPButton>
        <VPButton
          theme="brand"
          @click="addToCalendar('ics')"
        >
          <IconPhCalendarPlus /> ICS
        </VPButton>
      </div>
    </div>
  </section>

  <section class="info custom-block">
    <div class="info-section">
      <p class="custom-block-title">
        <IconPhMapPin /> Location
      </p>
      <h2 class="text-brand">
        National Taiwan University of Science and Technology
      </h2>
      <p>{{ venueAddress }}<CopyButton :source="venueAddress" /></p>
      <LeafletMap class="map" />
      <div class="actions">
        <VPButton
          href="https://www.openstreetmap.org/relation/5355856"
          target="_blank"
          theme="brand"
        >
          <IconPhMagnifyingGlass /> OpenStreetMap
        </VPButton>
        <VPButton
          href="https://www.google.com/maps/search/?api=1&query=國立臺灣科技大學&query_place_id=ChIJrcDEdiGqQjQRVfQp7kRe25A"
          target="_blank"
          theme="brand"
        >
          <IconPhGoogleLogo /> Google Maps
        </VPButton>
        <VPButton
          href="https://maps.apple.com/place?auid=1091116063745527859"
          target="_blank"
          theme="brand"
        >
          <IconPhAppleLogo /> Apple Maps
        </VPButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
svg {
  vertical-align: text-bottom;
  display: inline-block;
}

.custom-block {
  .custom-block-title {
    font-size: large;
  }

  h2 {
    margin: 24px 0 16px;
    padding: 0;
    border-top: none;

    .header-anchor {
      display: none;
    }
  }

  /* Reset VitePress styles for map buttons */
  .actions {
    display: flex;
    gap: 8px;
    margin: 8px 0;
    overflow-x: auto;

    a {
      text-decoration: none;
    }
  }

  :deep(a:hover) {
    opacity: unset;
  }
}

.map {
  width: 100%;
  height: 400px;
  margin: 16px 0;
  border-radius: 4px;
}
</style>
