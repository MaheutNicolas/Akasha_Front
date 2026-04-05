<template>
    <Header></Header>
    <div class="home">
        <div class="home__header">
        <h1 class="home__title">Menu Principal</h1>
        <p class="home__sub">Sélectionnez une option</p>
        </div>

        <nav class="home__nav">

        <RouterLink to="/rune" class="home__item">
            <span class="home__item-icon">⬡</span>
            <span class="home__item-label">Création de rune</span>
            <span class="home__item-arrow">→</span>
        </RouterLink>

        <RouterLink to="/explore" class="home__item">
            <span class="home__item-icon">◈</span>
            <span class="home__item-label">Explorer</span>
            <span class="home__item-arrow">→</span>
        </RouterLink>

        <RouterLink to="/mail" class="home__item">
            <span class="home__item-icon">✦</span>
            <span class="home__item-label">Messages</span>
            <span class="home__item-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
            <span class="home__item-arrow">→</span>
        </RouterLink>
        </nav>
    </div>
    <Footer></Footer>
</template>

<script setup>
import Header from '@/component/navigation/Header.vue';
import Footer from '@/component/navigation/Footer.vue';

defineProps({
  unreadCount: { type: Number, default: 2 }
})
</script>

<style scoped></style>
