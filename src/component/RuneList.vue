<template>
  <div class="rune-list">

    <div
      v-for="rune in runes"
      :key="rune.id"
      class="rune-list__item"
      :class="{
        'is-readonly': readonly,
        'is-active':   selected?.id === rune.id
      }"
      @click="!readonly && emit('select', rune)"
    >
      <img class="rune-list__preview" :src="rune.image" alt="">

      <span class="rune-list__name">{{ rune.name }}</span>

      <span class="rune-list__arrow" v-if="!readonly">→</span>
    </div>

    <div class="rune-list__empty" v-if="runes.length === 0">
      Aucune rune forgée
    </div>

  </div>
</template>

<script setup>
defineProps({
  runes:    { type: Array,   default: () => [] },
  selected: { type: Object,  default: null     },
  readonly: { type: Boolean, default: false    }
})

const emit = defineEmits(['select'])
</script>