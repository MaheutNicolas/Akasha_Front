<!-- LoginPage.vue -->
<template>
  <div class="login">

    <div class="login__card">

      <div class="login__header">
        <h1 class="login__title">AKASHA</h1>
        <p class="login__sub">Tramis Strata</p>
      </div>

      <form class="login__form" @submit.prevent="handleSubmit">

        <div class="login__field">
          <label class="login__label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="login__input"
            :class="{ 'is-error': errors.email }"
            placeholder="player@akasha.com"
            autocomplete="email"
          />
          <span class="login__error" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="login__field">
          <label class="login__label">Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            class="login__input"
            :class="{ 'is-error': errors.password }"
            placeholder="••••••••"
            autocomplete="current-password"
          />
          <span class="login__error" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <span class="login__error login__error--global" v-if="errors.global">
          {{ errors.global }}
        </span>

        <button class="login__btn" type="submit" :disabled="loading">
          <span v-if="!loading">Connexion</span>
          <span v-else class="login__loader"></span>
        </button>

      </form>

      <p class="login__register">
        Pas encore de compte ? <br>
        <RouterLink to="/register">Créer un accès</RouterLink>
      </p>

    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuth from '@/function/useAuth.js'

const router  = useRouter()
const { login } = useAuth()
const loading = ref(false)

const form   = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '', global: '' })

function validate() {
  errors.email    = ''
  errors.password = ''
  errors.global   = ''

  if (!form.email)    errors.email    = 'Email requis'
  if (!form.password) errors.password = 'Mot de passe requis'

  return !errors.email && !errors.password
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true

  try {
    await login(form.email, form.password)
    router.push('/game')
  } catch (e) {
    errors.global = e.message
  } finally {
    loading.value = false
  }
}
</script>