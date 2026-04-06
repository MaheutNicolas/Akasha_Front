<template>
    <Back />
    <div class="explore">

        <div class="explore__panel">

        <div class="explore__header">
            <h2 class="explore__title">Explorer</h2>
            <p class="explore__sub">Entrez des coordonnées pour localiser un noeud</p>
        </div>

        <form class="explore__form" @submit.prevent="handleSubmit">
            <div class="explore__coords">

            <div class="explore__field">
                <label class="explore__label">X</label>
                <input
                v-model.number="coords.x"
                type="number"
                class="explore__input"
                :class="{ 'is-error': errors.x }"
                placeholder="0"
                @input="clearResult"
                />
                <span class="explore__error" v-if="errors.x">{{ errors.x }}</span>
            </div>

            <span class="explore__sep">·</span>

            <div class="explore__field">
                <label class="explore__label">Y</label>
                <input
                v-model.number="coords.y"
                type="number"
                class="explore__input"
                :class="{ 'is-error': errors.y }"
                placeholder="0"
                @input="clearResult"
                />
                <span class="explore__error" v-if="errors.y">{{ errors.y }}</span>
            </div>

            </div>

            <button class="explore__btn" type="submit" :disabled="loading">
            <span v-if="!loading">◈ Localiser</span>
            <span v-else class="explore__loader"></span>
            </button>

        </form>

        <div class="explore__error explore__error--global" v-if="errors.global">
            {{ errors.global }}
        </div>

        </div>

        <!-- Résultat -->
        <div class="explore__result" v-if="location">

        <div class="explore__result-head">
            <div class="explore__result-coords">
            <span>{{ location.x }}</span>
            <span class="explore__result-sep">·</span>
            <span>{{ location.y }}</span>
            </div>
            <div class="explore__result-tags">
            <span
                v-for="tag in location.tags"
                :key="tag"
                class="explore__tag"
            >
                {{ tag }}
            </span>
            </div>
        </div>

        <h2 class="explore__result-name">{{ location.name }}</h2>

        <p class="explore__result-desc">{{ location.description }}</p>

        <div class="explore__result-meta" v-if="location.entities?.length">
            <span class="explore__meta-label">Entités détectées</span>
            <div class="explore__meta-list">
            <span
                v-for="entity in location.entities"
                :key="entity"
                class="explore__meta-item"
            >
                {{ entity }}
            </span>
            </div>
        </div>

        <button class="explore__btn explore__btn--go" @click="travel">
            → Voyager ici
        </button>

        </div>

    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Back from '@/component/Back.vue';
import useAuth from '@/function/useAuth';

const { getAuthHeader } = useAuth()

const coords   = reactive({ x: null, y: null })
const errors   = reactive({ x: '', y: '', global: '' })
const location = ref(null)
const loading  = ref(false)

function clearResult() {
  location.value = null
  errors.global  = ''
}

function validate() {
  errors.x = coords.x === null || coords.x === '' ? 'Requis' : ''
  errors.y = coords.y === null || coords.y === '' ? 'Requis' : ''
  return !errors.x && !errors.y
}

async function handleSubmit() {
  if (!validate()) return

  loading.value  = true
  location.value = null
  errors.global  = ''

  try {
    const res = await fetch(`/api/explore?x=${coords.x}&y=${coords.y}`, {
      headers: { ...getAuthHeader() }
    })

    if (res.status === 404) {
      errors.global = 'Aucun lieu trouvé à ces coordonnées'
      return
    }

    if (!res.ok) throw new Error()

    location.value = await res.json()

  } catch {
    errors.global = 'Erreur de connexion au serveur'
  } finally {
    loading.value = false
  }
}

function travel() {
  // navigation vers le lieu
  console.log('Voyager vers', location.value)
}
</script>