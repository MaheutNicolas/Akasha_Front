<template>
  <header class="header">
    <nav class="header__nav">

      <RouterLink to="/" class="header__logo">AKASHA</RouterLink>

      <ul class="header__links">
        <!-- <li><RouterLink to="/game" active-class="is-active">Grille</RouterLink></li>
        <li><RouterLink to="/grimoire" active-class="is-active">Grimoire</RouterLink></li>
        <li><RouterLink to="/journal" active-class="is-active">Journal</RouterLink></li> -->
      </ul>

      <div class="header__right">
        <span class="header__player" v-if="player">{{ player }}</span>
      </div>

    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';

let player = "nico";

</script>