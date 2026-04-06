<template>
  <div class="game-map__viewport" ref="viewportRef">
    <div
      class="game-map__canvas"
      ref="canvasRef"
      :style="canvasStyle"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart.prevent="startTouch"
      @touchmove.prevent="onTouch"
      @touchend="stopDrag"
    >
      <div
        v-for="(row, y) in grid"
        :key="y"
        class="game-map__row"
      >
        <span
          v-for="(cell, x) in row"
          :key="x"
          class="game-map__cell"
          :class="cell.class"
        >{{ cell.char }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'

const props = defineProps({
  map: { type: Object, required: true }
})

const SCALE = 3

const NODE_LABELS = {
  default: '·',
  enemy:   '◆',
  boss:    '✦',
  item:    '⬡',
  locked:  '▣',
  visited: '·',
  player:  '◉',
}

// ── Grille ─────────────────────────────────────────────────────────────────
const grid = computed(() => {
  const { nodes, paths, player, enemies } = props.map

  const maxX = Math.max(...nodes.map(n => n.x))
  const maxY = Math.max(...nodes.map(n => n.y))
  const cols  = maxX * SCALE + 4
  const rows  = maxY * SCALE + 2

  const g = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ char: ' ', class: 'is-empty' }))
  )

  const set = (x, y, char, cls) => {
    if (y >= 0 && y < rows && x >= 0 && x < cols) {
      g[y][x] = { char, class: cls }
    }
  }

  // ── Chemins ──────────────────────────────────────────────────────────────
  paths?.forEach(({ from, to }) => {
    const a = nodes.find(n => n.id === from)
    const b = nodes.find(n => n.id === to)
    if (!a || !b) return

    const ax = a.x * SCALE + 1
    const ay = a.y * SCALE
    const bx = b.x * SCALE + 1
    const by = b.y * SCALE

    const dx = Math.sign(bx - ax)
    const dy = Math.sign(by - ay)

    if (dy === 0) {
      for (let x = ax + 2; x < bx - 1; x += dx) {
        set(x, ay, '·', 'is-path')
      }
    } else if (dx === 0) {
      for (let y = ay + 1; y < by; y++) {
        set(ax, y, '·', 'is-path')
      }
    } else {
      let cx = ax + dx
      let cy = ay + dy
      const char = (dx > 0 && dy > 0) || (dx < 0 && dy < 0) ? '·' : '·'
      while (cx !== bx && cy !== by) {
        set(cx, cy, char, 'is-path')
        cx += dx
        cy += dy
      }
    }
  })

  // ── Nodes ─────────────────────────────────────────────────────────────────
  nodes?.forEach(node => {
    const px = node.x * SCALE
    const py = node.y * SCALE

    const isPlayer = player?.nodeId === node.id
    const enemy    = enemies?.find(e => e.nodeId === node.id)

    let cls   = 'is-node'
    let inner = NODE_LABELS.default

    if (isPlayer)                  { cls = 'is-node is-player'; inner = NODE_LABELS.player  }
    else if (enemy?.type === 'boss') { cls = 'is-node is-boss';   inner = NODE_LABELS.boss   }
    else if (enemy)                { cls = 'is-node is-enemy';  inner = NODE_LABELS.enemy   }
    else if (node.type === 'item')   { cls = 'is-node is-item';   inner = NODE_LABELS.item   }
    else if (node.type === 'locked') { cls = 'is-node is-locked'; inner = NODE_LABELS.locked }
    else if (node.type === 'visited'){ cls = 'is-node is-visited';inner = NODE_LABELS.visited}

    set(px,     py, '[', cls)
    set(px + 1, py, inner, cls)
    set(px + 2, py, ']', cls)
  })

  return g
})

// ── Drag ───────────────────────────────────────────────────────────────────
const viewportRef = ref(null)
const canvasRef   = ref(null)

const offset   = reactive({ x: 40, y: 40 })
const dragging = ref(false)
const origin   = reactive({ x: 0, y: 0 })

const canvasStyle = computed(() => ({
  transform: `translate(${offset.x}px, ${offset.y}px)`,
  cursor: dragging.value ? 'grabbing' : 'grab',
}))

function startDrag(e) {
  dragging.value = true
  origin.x = e.clientX - offset.x
  origin.y = e.clientY - offset.y
}

function onDrag(e) {
  if (!dragging.value) return
  offset.x = e.clientX - origin.x
  offset.y = e.clientY - origin.y
}

function stopDrag() { dragging.value = false }

// Touch
let lastTouch = null

function startTouch(e) {
  lastTouch = e.touches[0]
  origin.x  = lastTouch.clientX - offset.x
  origin.y  = lastTouch.clientY - offset.y
}

function onTouch(e) {
  const t = e.touches[0]
  offset.x = t.clientX - origin.x
  offset.y = t.clientY - origin.y
}
</script>