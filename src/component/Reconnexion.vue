<template>
  <div class="reconnect">
    <button
      class="reconnect__btn" 
      @click="reload" >
        Reconnexion
    </button>
  </div>
</template>

<script setup>
import request from '@/function/request';

const props = defineProps({
  mapX: { type: Number },
  mapY: { type: Number },
})

async function reload() {
  const response = request('GET', `/api/explore?x=${props.mapX}&y=${props.mapY}`);
  window.location.reload(true);
}

</script>