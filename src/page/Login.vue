<!-- LoginPage.vue -->
<template>
  <div class="login-register">

    <div class="login-register__card">

      <div class="login-register__header">
        <h1 class="login-register__title">AKASHA</h1>
        <p class="login-register__sub">Tramis Strata</p>
      </div>

      <form class="form" @submit.prevent="handleSubmit">

        <div class="form__field">
          <label class="form__label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form__input"
            :class="{ 'is-error': errors.email }"
            placeholder="player@akasha.com"
            autocomplete="email"
          />
          <span class="form__error" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form__field">
          <label class="form__label">Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            class="form__input"
            :class="{ 'is-error': errors.password }"
            placeholder="••••••••"
            autocomplete="current-password"
          />
          <span class="form__error" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <span class="form__error form__error--global" v-if="errors.global">
          {{ errors.global }}
        </span>

        <button class="form__btn" type="submit" :disabled="loading">
          <span v-if="!loading">Connexion</span>
          <span v-else class="form__loader"></span>
        </button>

      </form>

      <p class="login-register__message">
        Pas encore de compte ? <br>
        <RouterLink to="/register">Créer un accès</RouterLink>
      </p>

    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '@/function/useAuth.js';

const router  = useRouter();
const { login } = useAuth();
const loading = ref(false);

const form   = reactive({ email: '', password: '' });
const errors = reactive({ email: '', password: '', global: '' });

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