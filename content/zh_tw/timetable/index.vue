<script setup lang="ts">
import TimeTable from './TimeTable.vue'

const { data } = await import('#loaders/session.data')
</script>

<template>
  <TimeTable :sessions="data.sessions" />
</template>
