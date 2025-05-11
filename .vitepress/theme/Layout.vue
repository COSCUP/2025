<script setup lang="ts">
import VPContent from '#components/VPContent.vue'
import { inBrowser, useData, useRoute } from 'vitepress'
import VPBackdrop from 'vitepress/dist/client/theme-default/components/VPBackdrop.vue'
import VPLocalNav from 'vitepress/dist/client/theme-default/components/VPLocalNav.vue'
import VPNav from 'vitepress/dist/client/theme-default/components/VPNav.vue'
import VPSkipLink from 'vitepress/dist/client/theme-default/components/VPSkipLink.vue'

import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar.js'
import { computed, provide, useSlots, watch, watchEffect } from 'vue'

const { frontmatter } = useData()

const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar,
} = useSidebar()

const route = useRoute()
watch(() => route.path, closeSidebar)

const slots = useSlots()
const heroImageSlotExists = computed(() => !!slots['home-hero-image'])

provide('hero-image-slot-exists', heroImageSlotExists)
</script>

<template>
  <div
    v-if="frontmatter.layout !== false"
    class="Layout"
    :class="frontmatter.pageClass"
  >
    <slot name="layout-top" />
    <VPSkipLink />
    <VPBackdrop
      class="backdrop"
      :show="isSidebarOpen"
      @click="closeSidebar"
    />
    <VPNav>
      <template #nav-bar-title-before>
        <slot name="nav-bar-title-before" />
      </template>
      <template #nav-bar-title-after>
        <slot name="nav-bar-title-after" />
      </template>
      <template #nav-bar-content-before>
        <slot name="nav-bar-content-before" />
      </template>
      <template #nav-bar-content-after>
        <slot name="nav-bar-content-after" />
      </template>
      <template #nav-screen-content-before>
        <slot name="nav-screen-content-before" />
      </template>
      <template #nav-screen-content-after>
        <slot name="nav-screen-content-after" />
      </template>
    </VPNav>
    <VPLocalNav
      :open="isSidebarOpen"
      @open-menu="openSidebar"
    />

    <VPContent :open="isSidebarOpen">
      <template #page-top>
        <slot name="page-top" />
      </template>
      <template #page-bottom>
        <slot name="page-bottom" />
      </template>

      <template #not-found>
        <slot name="not-found" />
      </template>
      <template #home-hero-before>
        <slot name="home-hero-before" />
      </template>
      <template #home-hero-info-before>
        <slot name="home-hero-info-before" />
      </template>
      <template #home-hero-info>
        <slot name="home-hero-info" />
      </template>
      <template #home-hero-info-after>
        <slot name="home-hero-info-after" />
      </template>
      <template #home-hero-actions-after>
        <slot name="home-hero-actions-after" />
      </template>
      <template #home-hero-image>
        <slot name="home-hero-image" />
      </template>
      <template #home-hero-after>
        <slot name="home-hero-after" />
      </template>
      <template #home-features-before>
        <slot name="home-features-before" />
      </template>
      <template #home-features-after>
        <slot name="home-features-after" />
      </template>

      <template #doc-footer-before>
        <slot name="doc-footer-before" />
      </template>
      <template #doc-before>
        <slot name="doc-before" />
      </template>
      <template #doc-after>
        <slot name="doc-after" />
      </template>
      <template #doc-top>
        <slot name="doc-top" />
      </template>
      <template #doc-bottom>
        <slot name="doc-bottom" />
      </template>

      <template #aside-top>
        <slot name="aside-top" />
      </template>
      <template #aside-bottom>
        <slot name="aside-bottom" />
      </template>
      <template #aside-outline-before>
        <slot name="aside-outline-before" />
      </template>
      <template #aside-outline-after>
        <slot name="aside-outline-after" />
      </template>
      <template #aside-ads-before>
        <slot name="aside-ads-before" />
      </template>
      <template #aside-ads-after>
        <slot name="aside-ads-after" />
      </template>
    </VPContent>

    <Footer />
  </div>
</template>

<style scoped>
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
