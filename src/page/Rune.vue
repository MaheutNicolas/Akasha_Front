<template>
  <div>
    <RuneCreator v-model="path" ref="gridRef" />

    <div class="actions">
      <button @click="gridRef.undoLast()">↩ Annuler</button>
      <button @click="gridRef.reset()">✕ Effacer</button>
      <button @click="invoke()">⬡ Invoquer</button>
    </div>

    <p>Séquence : {{ path.join(' → ') }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RuneCreator from '@/component/RuneCreator.vue'

const path    = ref([])
const gridRef = ref(null)

function invoke() {
  console.log('Pattern envoyé :', path.value)
}
</script>