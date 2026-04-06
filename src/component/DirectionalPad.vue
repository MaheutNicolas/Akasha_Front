<template>
  <div class="dpad">

    <button
      class="dpad__btn dpad__btn--up"
      @click="emit('move', 'up')"
      :disabled="!directions.up"
    >▲</button>

    <button
      class="dpad__btn dpad__btn--left"
      @click="emit('move', 'left')"
      :disabled="!directions.left"
    >◀</button>

    <div class="dpad__center">
      <span class="dpad__center-icon">◉</span>
    </div>

    <button
      class="dpad__btn dpad__btn--right"
      @click="emit('move', 'right')"
      :disabled="!directions.right"
    >▶</button>

    <button
      class="dpad__btn dpad__btn--down"
      @click="emit('move', 'down')"
      :disabled="!directions.down"
    >▼</button>

  </div>
</template>

<script setup>
defineProps({
  directions: {
    type: Object,
    default: () => ({ up: true, down: true, left: true, right: true })
  }
})

const emit = defineEmits(['move'])
</script>