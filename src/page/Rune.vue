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
import { ref, reactive } from 'vue';
import RuneCreator from '@/component/RuneCreator.vue';
import RuneList from '@/component/RuneList.vue';

const path        = ref([])
const gridRef     = ref(null)
const name        = ref('')
const description = ref('')
const loading     = ref(false)
const result      = ref(null)
const errors      = reactive({ name: '', global: '' })

const runes = [
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
   {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
   {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
  
]

function handleReset() {
  gridRef.value.reset()
  result.value  = null
  errors.global = ''
}

function validate() {
  errors.name = ''
  if (path.value.length < 3) { errors.global = 'Tracez au moins 3 nœuds'; return false }
  if (!name.value.trim())    { errors.name   = 'Nom requis';               return false }
  return true
}

async function invoke() {
  if (!validate()) return

  loading.value = true
  result.value  = null
  errors.global = ''

  try {
    const res = await fetch('/api/runes', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({
        name:        name.value.trim(),
        description: description.value.trim(),
        path:        path.value
      })
    })

    if (res.status === 409) {
      errors.global = 'Ce motif est déjà associé à une rune'
      return
    }

    if (!res.ok) throw new Error()

    result.value = await res.json()
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