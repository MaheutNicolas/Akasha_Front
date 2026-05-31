<template>
  <Transition name="viewer">
    <div v-if="image" class="image-viewer" @click.self="$emit('close')">
      <div class="image-viewer__box">
        <button class="image-viewer__close" @click="$emit('close')" aria-label="Fermer">
          <i class="ti ti-x" />
        </button>
        <img :src="image.src" :alt="image.caption ?? ''" class="image-viewer__img" />
        <span v-if="image.caption" class="image-viewer__caption">{{ image.caption }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({ image: Object });
defineEmits(['close']);
</script>