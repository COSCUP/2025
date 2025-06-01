<script setup lang="ts">
import { inBrowser, useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { watchEffect } from 'vue'

const { lang } = useData()

watchEffect(() => {
  if (inBrowser) {
    document.cookie = `lang=${lang.value};path=/`
  }
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-before>
      <Banner />
    </template>
    <template #layout-bottom>
      <Footer />
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
</style>
