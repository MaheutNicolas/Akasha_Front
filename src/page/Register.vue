<!-- RegisterPage.vue -->
<template>
  <div class="register">
    <div class="register__card">
      <div class="register__header">
        <h1 class="register__title">AKASHA</h1>
        <p class="register__sub">Créer un accès</p>
      </div>
      <form class="register__form" @submit.prevent="handleSubmit">
        <div class="register__field">
          <label class="register__label">Nom d'invocateur</label>
          <input
            v-model="form.username"
            type="text"
            class="register__input"
            :class="{ 'is-error': errors.username }"
            placeholder="Mage_Errant"
            autocomplete="username"
          />
          <span class="register__error" v-if="errors.username">{{ errors.username }}</span>
        </div>
        <div class="register__field">
          <label class="register__label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="register__input"
            :class="{ 'is-error': errors.email }"
            placeholder="player@akasha.com"
            autocomplete="email"
          />
          <span class="register__error" v-if="errors.email">{{ errors.email }}</span>
        </div>
        <div class="register__field">
          <label class="register__label">Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            class="register__input"
            :class="{ 'is-error': errors.password }"
            placeholder="••••••••"
            autocomplete="new-password"
          />
          <span class="register__error" v-if="errors.password">{{ errors.password }}</span>
        </div>
        <div class="register__field">
          <label class="register__label">Confirmer le mot de passe</label>
          <input
            v-model="form.confirm"
            type="password"
            class="register__input"
            :class="{ 'is-error': errors.confirm }"
            placeholder="••••••••"
            autocomplete="new-password"
          />
          <span class="register__error" v-if="errors.confirm">{{ errors.confirm }}</span>
        </div>
        <span class="register__error register__error--global" v-if="errors.global">
          {{ errors.global }}
        </span>
        <button class="register__btn" type="submit" :disabled="loading">
          <span v-if="!loading">Initialiser le compte</span>
          <span v-else class="register__loader"></span>
        </button>
      </form>
      <p class="register__login">
        Déjà un accès ? <br>
        <RouterLink to="/login">Se connecter</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const defaultUri = import.meta.env.VITE_API_URL;
const router  = useRouter()
const loading = ref(false)

console.log(defaultUri);


const form = reactive({
  username: '',
  email:    '',
  password: '',
  confirm:  '',
})

const errors = reactive({
  username: '',
  email:    '',
  password: '',
  confirm:  '',
  global:   '',
})

function validate() {
  errors.username = ''
  errors.email    = ''
  errors.password = ''
  errors.confirm  = ''
  errors.global   = ''

  if (!form.username)
    errors.username = "Nom d'invocateur requis"
  else if (form.username.length < 3)
    errors.username = "3 caractères minimum"

  if (!form.email)
    errors.email = 'Email requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Email invalide'

  if (!form.password)
    errors.password = 'Mot de passe requis'
  else if (form.password.length < 8)
    errors.password = '8 caractères minimum'

  if (!form.confirm)
    errors.confirm = 'Confirmation requise'
  else if (form.confirm !== form.password)
    errors.confirm = 'Les mots de passe ne correspondent pas'

  return !errors.username && !errors.email && !errors.password && !errors.confirm
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    const res = await fetch(defaultUri + '/api/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        username: form.username,
        email:    form.email,
        password: form.password,
      }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message ?? 'Erreur lors de la création du compte')
    }
    router.push('/login')
  } catch (e) {
    errors.global = e.message
  } finally {
    loading.value = false
  }
}
</script>