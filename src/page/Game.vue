<template>
    <Terminal :initialMessages="messages" ref="terminal"/>
    <button @click="addMessage"> ADD</button>
</template>

<script setup>
import Terminal from '@/component/Terminal.vue';
import { ref } from 'vue';

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

</script>

