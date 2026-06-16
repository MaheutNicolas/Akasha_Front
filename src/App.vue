<template>
  <Header v-if="showHeader" :hasBackButton="showBack" />
  <RouterView />
  <Footer v-if="showFooter" />
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

const hiddenRoutesHeader  = ['/login', '/register'];
const hiddenRoutesFooter  = ['/login', '/register', '/game'];
const publicRoutes  = ['/login', '/register'];
const hiddenBackRoutes = [ '/' ];

const showHeader = computed(() =>
  !hiddenRoutesHeader.some(r => route.path.startsWith(r))
)

const showFooter = computed(() =>
  !hiddenRoutesFooter.some(r => route.path.startsWith(r))
)

const showBack = computed(() =>
  !hiddenBackRoutes.some(r => route.path == r)
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