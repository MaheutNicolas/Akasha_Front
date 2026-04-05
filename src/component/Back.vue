<template>
    <div class="back">
        <button class="btn" @click="back">Retours</button>
    </div>
</template>

<script setup>
import { router } from '@/router';

function back() {
    router.back();
}

</script>
