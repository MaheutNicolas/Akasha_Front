<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="emit('update:modelValue', false)">
      <div class="modal">
        <div class="modal__header">
          <span class="modal__title">Ordre des runes</span>
          <button class="modal__close" @click="emit('update:modelValue', false)">✕</button>
        </div>

        <div class="modal__body">
          <div
            v-for="(rune, i) in localOrder"
            :key="rune.id"
            class="rune-row"
            :class="{ 'is-drag-over': dragOver === i, 'is-dragging': dragSrc === i }"
            draggable="true"
            @dragstart="onDragStart(i)"
            @dragend="onDragEnd"
            @dragover.prevent="dragOver = i"
            @dragleave="dragOver = null"
            @drop.prevent="onDrop(i)"
          >
            <span class="rune-row__handle">⠿</span>
            <span class="rune-row__badge">{{ i + 1 }}</span>
            <img class="rune-row__preview" :src="'/rune/' + rune.image" alt="">
            <span class="rune-row__name">{{ rune.name }}</span>
          </div>
        </div>

        <div class="modal__footer">
          <button class="btn" @click="emit('update:modelValue', false)">Annuler</button>
          <button class="btn btn--primary" @click="submit">Confirmer</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import request from '@/function/request'
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  runes:      { type: Array,   default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'saved'])

const localOrder = ref([])
const dragSrc    = ref(null)
const dragOver   = ref(null)

watch(() => props.runes, runes => {
  localOrder.value = [...props.runes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}, { immediate: true })

function onDragStart(i) { dragSrc.value = i }
function onDragEnd()    { dragSrc.value = null; dragOver.value = null }

function onDrop(targetIdx) {
  if (dragSrc.value === null || dragSrc.value === targetIdx) return
  const arr  = [...localOrder.value]
  const [moved] = arr.splice(dragSrc.value, 1)
  arr.splice(targetIdx, 0, moved)
  localOrder.value = arr
  dragSrc.value  = null
  dragOver.value = null
}

async function submit() {
  const data = localOrder.value.map((r, i) => ({ id: r.linkId, order: i }))
  const updated = localOrder.value.map((r, i) => ({ ...r, order: i + 1 }))
  
  await request('POST', '/api/runes/order', data);

  emit('saved', updated)
  emit('update:modelValue', false)
}
</script>