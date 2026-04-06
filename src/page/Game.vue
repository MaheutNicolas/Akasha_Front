<template>
    <div class="game">
        <div class="game__column">
            <div class="game__map">
                <GameMap :map="mapData" />
            </div>
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
import { ref } from 'vue';

const mapData = {
  nodes: [
    { id: 'a', x: 0, y: 0, type: 'visited', label: 'Entrée'     },
    { id: 'b', x: 2, y: 0, type: 'default', label: 'Carrefour'  },
    { id: 'c', x: 4, y: 0, type: 'item',    label: 'Scriptorium'},
    { id: 'd', x: 2, y: 2, type: 'default', label: 'Crypte'     },
    { id: 'e', x: 4, y: 2, type: 'locked',  label: 'Scellé'     },
    { id: 'f', x: 3, y: 4, type: 'default', label: 'Boss'       },
  ],
  paths: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'b', to: 'd' },
    { from: 'c', to: 'e' },
    { from: 'd', to: 'f' },
  ],
  player:  { nodeId: 'b' },
  enemies: [
    { nodeId: 'f', type: 'boss'  },
    { nodeId: 'd', type: 'basic' },
  ]
}

const runes = [
  {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  },
   {
    "id": "1",
    "name": "Lister",
    "image": "/search.svg"
  }
]

const terminal = ref(null);

let messages = [
    {
        source: "ÉVÉNEMENT",
        html: "Le grattement s'intensifie. La paroi ouest vibre légèrement. Une fissure de lumière bleue court le long du joint de pierre.",
    },
];

function addMessage() {
    terminal.value.addMessage({
        source: "SYSTÈME",
        html: "Le grattement s'intensifie. La paroi ouest vibre légèrement. Une fissure de lumière bleue court le long du joint de pierre.",
    });
}

function handleMove(direction) {
  // direction = 'up' | 'down' | 'left' | 'right'
  console.log('Déplacement :', direction)
}
</script>

