<template>
  <Header v-if="showHeader" />
  <RouterView />
  <Footer v-if="showHeader" />
</template>

<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import Header from '@/component/navigation/Header.vue'
import Footer from '@/component/navigation/Footer.vue'
import useAuth  from '@/function/useAuth'

const route  = useRoute()
const router = useRouter()
const { isLoggedIn } = useAuth()

const hiddenRoutes  = ['/login', '/register', '/game'];
const publicRoutes  = ['/login', '/register'];

const showHeader = computed(() =>
  !hiddenRoutes.some(r => route.path.startsWith(r))
)

watch(
  () => route.path,
  (path) => {
    const isPublic = publicRoutes.some(r => path.startsWith(r))
    if (!isPublic && !isLoggedIn.value) {
      router.push('/login')
    }
  },
  { immediate: true }
)
</script>