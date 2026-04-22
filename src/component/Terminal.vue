<template>
  <div class="t-shell">
    <div class="t-chrome">
      <span class="t-dot first" />
      <span class="t-dot second" />
      <span class="t-dot third" />
      <span class="t-chrome__title">AKASHA · TERMINAL</span>
    </div>
    <div class="t-feed" ref="feedRef">
      <TransitionGroup name="msg">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="t-msg"
        >
          <div class="t-msg__header" v-if="msg.showHeader">
            <span class="t-msg__source" :class="sourceClass(msg.source)">
              {{ msg.source }}
            </span>
            <span class="t-msg__time" v-if="msg.time">{{ msg.time }}</span>
          </div>
          <div class="t-msg__body" v-html="'> ' + msg.html" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

// ── Types ──────────────────────────────────────────────────────────────────────
// Message: { source, html, time? }
// Source: 'SYSTEM' | 'ENV' | 'ARCANE' | 'EVENT'

// ── Props ──────────────────────────────────────────────────────────────────────
const props = defineProps({
  initialMessages: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['command'])

// ── State ──────────────────────────────────────────────────────────────────────
const feedRef  = ref(null)
const messages = ref([])

// ── Helpers ────────────────────────────────────────────────────────────────────
function now() {
  return new Date().toTimeString().slice(0, 8)
}

function sourceClass(source) {
  const map = {
    'SYSTEM':        'src-sys',
    'ENV':           'src-env',
    'ARCANE':        'src-lore',
    'EVENT':         'src-warn',
  }
  return map[source] ?? 'src-sys'
}

async function scrollToBottom() {
  await nextTick()
  if (feedRef.value) {
    feedRef.value.scrollTop = feedRef.value.scrollHeight
  }
}

// Calcule showHeader au moment de l'insertion, pas pendant le render
function resolveHeader(msg) {
  const last = messages.value.at(-1)
  const showHeader = !last || last.source !== msg.source
  return { ...msg, showHeader }
}

// ── Public API ────────────────────────────────────────────────────────────────
function addMessage(msg) {
  messages.value.push(resolveHeader({ time: now(), ...msg }))
  scrollToBottom()
}

function clearFeed() {
  messages.value = []
}

// ── Init ───────────────────────────────────────────────────────────────────────
onMounted(() => {
  props.initialMessages.forEach(msg => addMessage(msg))
  scrollToBottom()
})

defineExpose({ addMessage, clearFeed })
</script>
