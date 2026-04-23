<template>
    <div class="game">
        <div class="game__column">
            <GameMap :map="mapData" />
            <DirectionalPad :directions="direction" @move="handleMove"/>
        </div>
        <div class="game__column">
            <Terminal :initialMessages="messages" ref="terminal"/>
        </div>
        <div class="game__column">
            <RuneList :runes="runes" @select="playRune"/>
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

const terminal   = ref(null);
const messages   = ref([]);
const runes      = ref([]);
const activeRune = ref([]);
const direction  = ref({ up: false, down: false, left: false, right: false });
const mapData    = ref({
  nodes: [],
  player: {},
  enemies: []
});

function addMessages(messages) {
  const list = Array.isArray(messages) ? messages : [messages];
  list.forEach(message => terminal.value.addMessage(message));
}

async function playRune(rune) {
  let response = await request('POST', '/api/game/rune', {'rune_id' : rune.id });
  setGameState(response);
}

async function handleMove(direction) {
  let response = await request('POST', '/api/game/move', {'direction' : direction});
  setGameState(response);
}

function updateDirections() {
  const x = mapData.value.state.player.x;
  const y = mapData.value.state.player.y;
  const pos = `${x},${y}`;

  const node = mapData.value.nodes[pos];

  direction.value = {  up: false, down: false, left: false, right: false };

  if (!node || !node.paths) return;
  
  node.paths.forEach(dir => {
    direction.value[dir] = true;
  });
}

onMounted( async () => {
  let response = await request('GET', '/api/session');
  setGameState(response);
  runes.value = response.runes
});

function setGameState(response) {
  if ( response.data?.map ) { 
    mapData.value = response.data.map;
    updateDirections();
  }
  if ( response.data?.activeRune ) { activeRune.value = response.data.activeRune; }
  if ( response.message ) { addMessages(response.message); }
}
</script>

