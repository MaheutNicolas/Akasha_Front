<template>
    <div class="game">
        <div class="game__column">
            <GameMap :map="mapData" />
            <Reconnexion v-if="gameStatus == 'game_over'" :mapX="mapX" :mapY="mapY"/>
            <DirectionalPad :directions="direction" @move="handleMove" v-else/>
        </div>
        <div class="game__column">
            <Terminal :initialMessages="messages" ref="terminal"/>
        </div>
        <div class="game__column">
            <RuneList :runes="runes" :selected="activeRune" @select="playRune"/>
        </div>

    </div>
</template>

<script setup>
import Terminal from '@/component/Terminal.vue';
import GameMap from '@/component/GameMap.vue';
import RuneList from '@/component/RuneList.vue';
import DirectionalPad from '@/component/DirectionalPad.vue';
import Reconnexion from '@/component/Reconnexion.vue'
import { onMounted, onUnmounted, ref, computed } from 'vue';
import request from '@/function/request';
import { loadKeybinds } from '@/function/keyBinds.js';

const terminal   = ref(null);
const gameStatus = ref("active");
const messages   = ref([]);
const runes      = ref([]);
const activeRune = ref(null);
const direction  = ref({ up: false, down: false, left: false, right: false });
const keybinds   = ref({});

const mapData    = ref({
  nodes: [],
  player: {},
  enemies: []
});
const mapX = ref(0);
const mapY = ref(0);

const sortedRunes = computed(() =>
  [...runes.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
)

function getKeyLabel(e) {
  return e.key
}

function onKeyDown(e) {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return

  const label = getKeyLabel(e)
  const binds = keybinds.value

  if (gameStatus.value !== 'game_over') {
    if (label === binds.up    && direction.value.up)    { e.preventDefault(); handleMove('up');    return }
    if (label === binds.down  && direction.value.down)  { e.preventDefault(); handleMove('down');  return }
    if (label === binds.left  && direction.value.left)  { e.preventDefault(); handleMove('left');  return }
    if (label === binds.right && direction.value.right) { e.preventDefault(); handleMove('right'); return }
  }

  for (let i = 1; i <= 9; i++) {
    if (label === binds[`r${i}`]) {
      const rune = sortedRunes.value[i - 1]
      if (rune) { e.preventDefault(); playRune(rune) }
      return
    }
  }
}

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

  setDirectionTo(false);

  if (!node || !node.paths) return;
  
  node.paths.forEach(dir => {
    direction.value[dir] = true;
  });
}

onMounted( async () => {
  keybinds.value = loadKeybinds()
  window.addEventListener('keydown', onKeyDown)
  let response = await request('GET', '/api/session');
  setGameState(response);
  runes.value = response.runes
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
});

function setGameState(response) {
  if ( response.data?.map ) { 
    mapData.value = response.data.map;
    updateDirections();
  }
  if ('activeRune' in (response.data ?? {})) {
    activeRune.value = response.data.activeRune;
    activeRune.value == null ?
      updateDirections() :
      setDirectionTo(true);
  }
  if ( response.message ) { addMessages(response.message); }
  if ( response.data?.status ) { gameStatus.value = response.data.status;}
  if ( response.x ) { mapX.value = response.x; }
  if ( response.y ) { mapY.value = response.y; }
}

function setDirectionTo(value = false) {
  direction.value = {  up: value, down: value, left: value, right: value };
}
</script>

