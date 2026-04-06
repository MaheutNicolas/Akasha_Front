<template>
    <Header v-if="showHeader" />
    <RouterView />
    <Footer v-if="showHeader" />
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import Header from '@/component/navigation/Header.vue';
import Footer from '@/component/navigation/Footer.vue';

const hiddenRoutes = ['/login', '/register', '/game'];
const route = useRoute();

const showHeader = computed(() =>
  !hiddenRoutes.some(r => route.path.startsWith(r))
)
</script>

