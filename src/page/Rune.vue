<template>
  <div class="rune-create">

    <div class="rune-create__left">
      <div class="rune-create__header">
        <h2 class="rune-create__title">Création de rune</h2>
        <p class="rune-create__sub">Tracez un motif sur la grille pour forger une rune</p>
      </div>

      <RuneCreator v-model="path" ref="gridRef" />

      <div class="rune-create__actions">
        <button class="rune-create__btn rune-create__btn--ghost" @click="gridRef.undoLast()">
          ↩ Annuler
        </button>
        <button class="rune-create__btn rune-create__btn--ghost" @click="handleReset">
          ✕ Effacer
        </button>
        <button
          class="rune-create__btn rune-create__btn--invoke"
          :disabled="path.length < 2 || loading"
          @click="invoke"
        >
          <span v-if="!loading">⬡ Invoquer</span>
          <span v-else class="rune-create__loader"></span>
        </button>
      </div>

    </div>

    <div class="rune-create__right">
      <RuneList :runes="runes" :readonly="true"/>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import RuneCreator from '@/component/RuneCreator.vue';
import RuneList from '@/component/RuneList.vue';
import request from '@/function/request';

const path        = ref([])
const gridRef     = ref(null)
const name        = ref('')
const description = ref('')
const loading     = ref(false)
const result      = ref(null)
const errors      = reactive({ global: '' })

const runes = ref([]);

onMounted( async () => {
  let response = await request('GET', '/api/runes');
  runes.value = response.data;
})

function handleReset() {
  gridRef.value.reset()
  result.value  = null
  errors.global = ''
}

async function invoke() {
  loading.value = true
  result.value  = null
  errors.global = ''

  console.dir(path.value);
  

  try {
    const response = await request('POST', '/api/rune', {'sequence' : path.value});
    if (response.success) {
      runes.value.push(response.data);
    }
    handleReset()
    name.value        = ''
    description.value = ''

  } catch {
    errors.global = 'Erreur lors de la création de la rune'
  } finally {
    loading.value = false
  }
}
</script>