<template>
    <div class="game">
        <div class="game__column">
            <GameMap :map="mapData" />
            <DirectionalPad :directions="{ up: true, down: false, left: true, right: false }" @move="handleMove"/>
        </div>
        <div class="game__column">
            <Terminal :initialMessages="messages" ref="terminal"/>
        </div>
        <div class="game__column">
            <RuneList :runes="runes"/>
        </div>

    </div>
</template>

<script setup>
import Terminal from '@/component/Terminal.vue';
import GameMap from '@/component/GameMap.vue';
import RuneList from '@/component/RuneList.vue';
import DirectionalPad from '@/component/DirectionalPad.vue';
import { onMounted, ref } from 'vue';
import request from '@/function/request';

const terminal = ref(null);
const messages = ref([]);
const rune     = ref([]);
const mapData  = ref({
  nodes: [],
  player: {},
  enemies: []
});

function addMessage(message) {
  terminal.value.addMessage(message);
}

function handleMove(direction) {
  // direction = 'up' | 'down' | 'left' | 'right'
  console.log('Déplacement :', direction)
}

onMounted( async () => {
  let response = await request('GET', '/api/session');
  mapData.value = response.data.map;

  console.dir(mapData);
  
});
</script>

