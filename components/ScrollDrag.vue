<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const scrollContainer = ref(null)

let isDragging = false
let startX = 0
let startY = 0
let scrollLeft = 0
let scrollTop = 0

function onMouseDown(e) {
  if (!scrollContainer.value) return
  isDragging = true
  scrollContainer.value.style.cursor = 'grabbing'
  startX = e.pageX - scrollContainer.value.offsetLeft
  startY = e.pageY - scrollContainer.value.offsetTop
  scrollLeft = scrollContainer.value.scrollLeft
  scrollTop = scrollContainer.value.scrollTop
}

function onMouseMove(e) {
  if (!isDragging || !scrollContainer.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const y = e.pageY - scrollContainer.value.offsetTop
  const walkX = x - startX
  const walkY = y - startY
  scrollContainer.value.scrollLeft = scrollLeft - walkX
  scrollContainer.value.scrollTop = scrollTop - walkY
}

function onMouseUp() {
  isDragging = false
  if (scrollContainer.value) scrollContainer.value.style.cursor = 'grab'
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <div
    ref="scrollContainer"
    class="scroll-container"
    @mousedown="onMouseDown"
  >
    <div class="inner-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  width: 600px;
  height: 400px;
  overflow: scroll;
  cursor: grab;
  user-select: none;
  border: 2px solid #ccc;
  background: #f9f9f9;
}

.inner-content {
  width: 2000px;
  height: 2000px;
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
}

.box {
  width: 100px;
  height: 100px;
  background: #ffb347;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
</style>
