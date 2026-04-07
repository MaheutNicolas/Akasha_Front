<!-- RegisterPage.vue -->
<template>
  <div class="login-register">
    <div class="login-register__card">
      <div class="login-register__header">
        <h1 class="login-register__title">AKASHA</h1>
        <p class="login-register__sub">Créer un accès</p>
      </div>
      <form class="form" @submit.prevent="handleSubmit">
        <div class="form__field">
          <label class="form__label">Nom d'invocateur</label>
          <input
            v-model="form.username"
            type="text"
            class="form__input"
            :class="{ 'is-error': errors.username }"
            placeholder="Mage_Errant"
            autocomplete="username"
          />
          <span class="form__error" v-if="errors.username">{{ errors.username }}</span>
        </div>
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
            autocomplete="new-password"
          />
          <span class="form__error" v-if="errors.password">{{ errors.password }}</span>
        </div>
        <div class="form__field">
          <label class="form__label">Confirmer le mot de passe</label>
          <input
            v-model="form.confirm"
            type="password"
            class="form__input"
            :class="{ 'is-error': errors.confirm }"
            placeholder="••••••••"
            autocomplete="new-password"
          />
          <span class="form__error" v-if="errors.confirm">{{ errors.confirm }}</span>
        </div>
        <span class="form__error form__error--global" v-if="errors.global">
          {{ errors.global }}
        </span>
        <button class="form__btn" type="submit" :disabled="loading">
          <span v-if="!loading">Initialiser le compte</span>
          <span v-else class="form__loader"></span>
        </button>
      </form>
      <p class="login-register__message">
        Déjà un accès ? <br>
        <RouterLink to="/login">Se connecter</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { setLogin } from '@/function/useAuth';

const defaultUri = import.meta.env.VITE_API_URL;
const router  = useRouter();
const loading = ref(false);

const form = reactive({
  username: '',
  email:    '',
  password: '',
  confirm:  '',
});

const errors = reactive({
  username: '',
  email:    '',
  password: '',
  confirm:  '',
  global:   '',
});

function validate() {
  errors.username = ''
  errors.email    = ''
  errors.password = ''
  errors.confirm  = ''
  errors.global   = ''

  if (!form.username)
    errors.username = "Nom d'invocateur requis";
  else if (form.username.length < 3)
    errors.username = "3 caractères minimum";

  if (!form.email)
    errors.email = 'Email requis';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Email invalide';

  if (!form.password)
    errors.password = 'Mot de passe requis';
  else if (form.password.length < 8)
    errors.password = '8 caractères minimum';

  if (!form.confirm)
    errors.confirm = 'Confirmation requise';
  else if (form.confirm !== form.password)
    errors.confirm = 'Les mots de passe ne correspondent pas';

  return !errors.username && !errors.email && !errors.password && !errors.confirm;
}

async function handleSubmit() {
  if (!validate()) return;
  loading.value = true;
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
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message ?? 'Erreur lors de la création du compte');
    }
    setLogin(data);
    router.push('/');
  } catch (e) {
    errors.global = e.message;
  } finally {
    loading.value = false;
  }
}
</script>