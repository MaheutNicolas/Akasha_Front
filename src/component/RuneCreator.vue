<template>
  <div class="rune-grid-wrap" ref="wrapRef">
    <svg class="rune-grid__svg" ref="svgRef"></svg>
    <div class="rune-grid__grid">
    <div
        v-for="id in 16"
        :key="id"
        :data-id="id"
        class="rune-grid__cell"
        :class="{ 'is-selected': selected.includes(id), 'is-first': selected[0] === id }"
        @click="toggleCell(id)"
        >
        <span class="rune-grid__dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const color = '#5b9bd5';
const wrapRef = ref(null)
const svgRef  = ref(null)
const selected = ref([...props.modelValue])

watch(() => props.modelValue, val => { selected.value = [...val] })

function toggleCell(id) {
    const idx = selected.value.indexOf(id)
    selected.value = idx !== -1
        ? selected.value.slice(0, idx)
        : [...selected.value, id]

    emit('update:modelValue', [...selected.value])
    drawLines()
}

function cellCenter(id) {
    const cell = wrapRef.value.querySelector(`[data-id="${id}"]`)
    const wrap = wrapRef.value.getBoundingClientRect()
    const cr   = cell.getBoundingClientRect()
    return {
        x: cr.left - wrap.left + cr.width  / 2,
        y: cr.top  - wrap.top  + cr.height / 2
    }
}

function drawLines() {
    const svg = svgRef.value
    svg.innerHTML = ''

    if (selected.value.length < 2) return

    for (let i = 0; i < selected.value.length - 1; i++) {
        const a = cellCenter(selected.value[i])
        const b = cellCenter(selected.value[i + 1])

        const halo = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ['x1','y1','x2','y2'].forEach((k, j) => halo.setAttribute(k, [a.x,a.y,b.x,b.y][j]))
        halo.setAttribute('stroke', color)
        halo.setAttribute('stroke-width', '24')
        halo.setAttribute('stroke-opacity', '0.08')
        halo.setAttribute('stroke-linecap', 'round')
        svg.appendChild(halo)

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ['x1','y1','x2','y2'].forEach((k, j) => line.setAttribute(k, [a.x,a.y,b.x,b.y][j]))
        line.setAttribute('stroke', color)
        line.setAttribute('stroke-width', '4')
        line.setAttribute('stroke-linecap', 'round')
        svg.appendChild(line)
    }

    selected.value.forEach((id, i) => {
        const p   = cellCenter(id)
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        dot.setAttribute('cx', p.x)
        dot.setAttribute('cy', p.y)
        dot.setAttribute('r', '4')
        dot.setAttribute('fill', color)
        svg.appendChild(dot)
    })
}

function reset()   { selected.value = []; emit('update:modelValue', []); drawLines() }
function undoLast(){ selected.value.pop(); emit('update:modelValue', [...selected.value]); drawLines() }

onMounted(() => window.addEventListener('resize', drawLines))
onUnmounted(() => window.removeEventListener('resize', drawLines))

defineExpose({ reset, undoLast, selected })
</script>