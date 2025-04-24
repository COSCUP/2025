<script setup lang='ts'>
import { onMounted, provide, ref, useSlots } from 'vue'

const slots = useSlots()
const tabs = ref<string[]>([])
const activeTab = ref<string>('')

onMounted(() => {
  tabs.value = Object.keys(slots).filter((name) => name.startsWith('title-')).map((name) => name.slice(6))
  if (tabs.value.length > 0) {
    activeTab.value = tabs.value[0]
  }
})

function selectTab(tab: string) {
  activeTab.value = tab
}

provide('activeTab', activeTab)
</script>

<template>
  <div class="tabs">
    <ul class="tab-list">
      <li
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: tab === activeTab }"
        @click="selectTab(tab)"
      >
        <slot
          :is-active="tab === activeTab"
          :name="`title-${tab}`"
        >
          {{ tab }}
        </slot>
      </li>
    </ul>
    <div class="tab-content">
      <template
        v-for="tab in tabs"
        :key="tab"
      >
        <div v-if="tab === activeTab">
          <slot :name="`content-${tab}`" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tab-list {
  display: flex;
  list-style-type: none;
  border-bottom: 1px solid #ccc;
  padding: 0px;
  margin: 0px;
  align-items: center;
  justify-content: start;
}

.vp-doc li + li {
  margin-top: 0px;
}

li {
  padding: 0.7rem 1rem;
  margin: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

li.active {
  color: #000;
  background-color: #fff;
  border-color: #ccc;
  border-bottom-color: #fff;
}

.tab-content {
  padding: 20px;
  border: 1px solid white;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}
</style>
