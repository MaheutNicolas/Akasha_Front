<template>
  <div class="rune-create">

    <div class="rune-create__left">
      <Back />
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

      <!-- Séquence -->
      <div class="rune-create__section">
        <p class="rune-create__label">Séquence tracée</p>
        <div class="rune-create__sequence">
          <template v-if="path.length > 0">
            <span
              v-for="(id, i) in path"
              :key="i"
              class="rune-create__seq-item"
            >
              <span class="rune-create__seq-arrow" v-if="i > 0">→</span>
              {{ id }}
            </span>
          </template>
          <span class="rune-create__seq-empty" v-else>—</span>
        </div>
      </div>

      <!-- Champ nom -->
      <div class="rune-create__section">
        <label class="rune-create__label">Nom de la rune</label>
        <input
          v-model="name"
          type="text"
          class="rune-create__input"
          :class="{ 'is-error': errors.name }"
          placeholder="Ex: Lister, Voyager..."
          maxlength="50"
        />
        <span class="rune-create__error" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <!-- Champ description -->
      <div class="rune-create__section">
        <label class="rune-create__label">Description</label>
        <textarea
          v-model="description"
          class="rune-create__textarea"
          placeholder="Ce que fait cette rune..."
          rows="4"
        ></textarea>
      </div>

      <!-- Feedback -->
      <div class="rune-create__feedback rune-create__feedback--ok" v-if="result">
        ✦ Rune "{{ result.name }}" forgée avec succès
      </div>
      <div class="rune-create__feedback rune-create__feedback--err" v-if="errors.global">
        {{ errors.global }}
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import RuneCreator from '@/component/RuneCreator.vue';
import Back from '@/component/Back.vue';

const path        = ref([])
const gridRef     = ref(null)
const name        = ref('')
const description = ref('')
const loading     = ref(false)
const result      = ref(null)
const errors      = reactive({ name: '', global: '' })

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