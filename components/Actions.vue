<script setup lang="ts">
interface actions {
  href: string
  display: string
}

defineProps<{
  actionsList: actions[]
}>()
</script>

<template>
  <div class="actions">
    <VPButton
      v-for="action in actionsList"
      :key="action.display"
      :href="action.href"
    >
      {{ action.display }}
    </VPButton>
  </div>
</template>

<style>
.actions {
  display: flex;
  flex-direction: row;
}

.VPButton {
  margin: 0 1rem;
}

@media (max-width: 960px) {
  .actions {
    flex-direction: column;
  }
  .VPButton {
    margin: 1rem 0;
  }
}
</style>
