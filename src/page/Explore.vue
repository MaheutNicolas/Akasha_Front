<template>
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

            <div class="explore__historic" v-if="historic.length">
                <p class="explore__sub">Historique</p>
                <div class="explore__historic-list">
                    <button
                    v-for="(pos, index) in historic"
                    :key="index"
                    class="explore__historic-btn"
                    :disabled="loading"
                    @click="exploreCoords(pos.x, pos.y)"
                    >
                    {{ pos.x }} · {{ pos.y }}
                    </button>
                    <button @click="getHistoric()" v-if="historic.length == 10">Tous voir</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import request from '@/function/request';
import { useRouter } from 'vue-router';

const coords   = reactive({ x: null, y: null })
const errors   = reactive({ x: '', y: '', global: '' })
const location = ref(null)
const loading  = ref(false)
const router   = useRouter();
const historic = ref([]);

function clearResult() {
  location.value = null
  errors.global  = ''
}

function validate() {
  errors.x = coords.x === null || coords.x === '' ? 'Requis' : ''
  errors.y = coords.y === null || coords.y === '' ? 'Requis' : ''
  return !errors.x && !errors.y
}

async function exploreCoords(x, y) {
    loading.value  = true
    location.value = null
    errors.global  = ''

    try {
        const response = await request('GET', `/api/explore?x=${x}&y=${y}`);
        if (response.success) {
            router.push('/game');
            return;
        }
        errors.global = response.message;
    } catch {
        errors.global = 'Erreur de connexion au serveur'
    } finally {
        loading.value = false
    }
}

async function handleSubmit() {
    if (!validate()) return
    await exploreCoords(coords.x, coords.y)
}

async function getHistoric( limit = null ) {
    const url = limit !== null
        ? `/api/historic?limit=${limit}`
        : `/api/historic`;
  
    try {
        const response = await request('GET', url);
        if (response.success) {
            historic.value = response.data;
            console.log(historic.value);
            return;
        }

        errors.global = response.message;

    } catch {
        errors.global = 'Erreur de connexion au serveur'
    }
}

getHistoric(10);
</script>