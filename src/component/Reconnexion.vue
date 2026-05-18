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
   try {
    const response = await request('GET', `/api/explore?x=${props.mapX}&y=${props.mapY}`);
    if (response.success) {
        window.location.reload(true);
        return;
    }
    console.log(response.message);

  } catch {
    console.log('Erreur de connexion au serveur');
  }
}

</script>