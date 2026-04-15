<template>
  <header class="header">
    <nav class="header__nav">

      <RouterLink to="/" class="header__logo">AKASHA</RouterLink>

      <ul class="header__links">
        <button class="back-btn" @click="back" v-if="hasBackButton">Retours</button>
      </ul>

      <div class="header__right">
        <span class="header__player" v-if="user">{{ user.replace(/"/g, '')  }}</span>
        <button @click="logout">Deconnexion</button>
      </div>

    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { router } from '@/router';
import useAuth from '@/function/useAuth';

const props = defineProps({
  hasBackButton: Boolean
})

function back() {
    router.back();
}

const { user, logout } = useAuth();

</script>