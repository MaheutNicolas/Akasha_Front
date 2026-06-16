<template>
  <header class="header">
    <nav class="header__nav">
      <RouterLink to="/" class="header__logo">AKASHA</RouterLink>

      <button
        class="header__burger"
        :class="{ 'is-open': isMenuOpen }"
        @click="isMenuOpen = !isMenuOpen"
        :aria-expanded="isMenuOpen"
        aria-label="Ouvrir le menu"
      >
        <span></span><span></span><span></span>
      </button>

      <div class="header__collapse" :class="{ 'is-open': isMenuOpen }">
        <div class="header__main">
          <button class="back-btn" @click="back" v-if="hasBackButton">Retour</button>
          <span v-else class="desktop"></span>
          <span class="header__player" v-if="user">{{ user.replace(/"/g, '') }}</span>
        </div>
        <div class="header__right">
          <button @click="logout">Déconnexion</button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { router } from '@/router';
import useAuth from '@/function/useAuth';

const props = defineProps({
  hasBackButton: Boolean
})

const isMenuOpen = ref(false);

function back() {
  router.back();
  isMenuOpen.value = false;
}

const { user, logout } = useAuth();
</script>