<template>
  <div class="game__map">
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
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'

const props = defineProps({
  map: { type: Object, required: true }
})

// ── Constantes ─────────────────────────────────────────────────────────────
const GRID_MIN  = 1
const GRID_MAX  = 29
const GRID_SIZE = GRID_MAX - GRID_MIN + 1 // 29 cases

// Chaque node occupe 2 cols (char + séparateur droit) et 2 rows (char + séparateur bas)
// → grille de caractères = 29*2 + 1 (bordure finale)
const COLS = GRID_SIZE * 2 + 1
const ROWS = GRID_SIZE * 2 + 1

const NODE_LABELS = {
  default: ' ',
  player:  '◉',
  enemy:   '◆',
  boss:    '✦',
}

// ── Helpers ────────────────────────────────────────────────────────────────
// Convertit une coordonnée de jeu (1-29) en index dans la grille de chars
const toCol = gx => (gx - GRID_MIN) * 2 + 1  // centre du node
const toRow = gy => (gy - GRID_MIN) * 2 + 1

// ── Grille ─────────────────────────────────────────────────────────────────
const grid = computed(() => {
  
  const nodes   = props.map?.nodes  ?? {}
  const player  = props.map?.state?.player
  const enemies = props.map?.state?.enemies ?? []

  // ── Bornes dynamiques selon les nodes présents ──────────────────────────
  const keys = Object.keys(nodes)
  if (keys.length === 0) return []

  const coords = keys.map(k => k.split(',').map(Number))
  const minX = Math.min(...coords.map(([x]) => x))
  const maxX = Math.max(...coords.map(([x]) => x))
  const minY = Math.min(...coords.map(([, y]) => y))
  const maxY = Math.max(...coords.map(([, y]) => y))

  const W = (maxX - minX) * 2 + 3  // +3 : marge d'un séparateur de chaque côté
  const H = (maxY - minY) * 2 + 3

  // Convertit une coord de jeu en index dans la grille locale
  const toCol = gx => (gx - minX) * 2 + 1
  const toRow = gy => (gy - minY) * 2 + 1

  // ── Init vide ─────────────────────────────────────────────────────────────
  const g = Array.from({ length: H }, () =>
    Array.from({ length: W }, () => ({ char: ' ', class: 'is-empty' }))
  )

  const set = (col, row, char, cls) => {
    if (row >= 0 && row < H && col >= 0 && col < W) {
      g[row][col] = { char, class: cls }
    }
  }

  // ── Traits entre nodes voisins ───────────────────────────────────────────
  // On trace uniquement si le node courant déclare le chemin ET que le voisin existe
  const OPPOSITE = { right: 'left', left: 'right', down: 'up', up: 'down' }
  const DELTA    = { right: [1, 0], left: [-1, 0], down: [0, 1], up: [0, -1] }

  Object.entries(nodes).forEach(([key, node]) => {
    const [gx, gy] = key.split(',').map(Number)
    const col = toCol(gx)
    const row = toRow(gy)

    Object.entries(node.paths ?? {}).forEach(([dir, path]) => {
      if (!path.passable) return

      const [dx, dy] = DELTA[dir]
      const neighborKey = `${gx + dx},${gy + dy}`

      // Le voisin doit exister dans les nodes débloqués
      if (!nodes[neighborKey]) return

      // Trait horizontal (left/right) → séparateur vertical entre les deux cols
      if (dir === 'right') set(col + 1, row, ' ', 'is-path')
      if (dir === 'left')  set(col - 1, row, ' ', 'is-path')
      // Trait vertical (up/down) → séparateur horizontal entre les deux rows
      if (dir === 'down')  set(col, row + 1, ' ', 'is-path')
      if (dir === 'up')    set(col, row - 1, ' ', 'is-path')
    })
  })

  // ── Séparateurs uniquement autour des nodes présents ─────────────────────
  Object.keys(nodes).forEach(key => {
    const [gx, gy] = key.split(',').map(Number)
    const col = toCol(gx)
    const row = toRow(gy)

    // Les 4 coins + 4 bords autour du node
    set(col - 1, row - 1, '+', 'is-sep')
    set(col + 1, row - 1, '+', 'is-sep')
    set(col - 1, row + 1, '+', 'is-sep')
    set(col + 1, row + 1, '+', 'is-sep')

    // Ne pose le trait que si pas déjà un passage ouvert
    const above = g[row - 1]?.[col]
    const below = g[row + 1]?.[col]
    const left  = g[row]?.[col - 1]
    const right = g[row]?.[col + 1]

    if (above?.class !== 'is-path') set(col,     row - 1, '─', 'is-sep')
    if (below?.class !== 'is-path') set(col,     row + 1, '─', 'is-sep')
    if (left?.class  !== 'is-path') set(col - 1, row,     '│', 'is-sep')
    if (right?.class !== 'is-path') set(col + 1, row,     '│', 'is-sep')
  })

  // ── Nodes ─────────────────────────────────────────────────────────────────
  Object.entries(nodes).forEach(([key, node]) => {
    const [gx, gy] = key.split(',').map(Number)
    const col = toCol(gx)
    const row = toRow(gy)

    const isPlayer = player?.x === gx && player?.y === gy
    const isBoss   = enemies.some(e => e.x === gx && e.y === gy && e.type === 'boss')
    const isEnemy  = enemies.some(e => e.x === gx && e.y === gy)

    let char = NODE_LABELS.default
    let cls  = 'is-node'

    if (isPlayer)    { char = NODE_LABELS.player; cls = 'is-node is-player' }
    else if (isBoss) { char = NODE_LABELS.boss;   cls = 'is-node is-boss'   }
    else if (isEnemy){ char = NODE_LABELS.enemy;  cls = 'is-node is-enemy'  }

    set(col, row, char, cls)
  })

  return g
})

// ── Drag ───────────────────────────────────────────────────────────────────
const viewportRef = ref(null)
const canvasRef   = ref(null)
const offset      = reactive({ x: 40, y: 40 })
const dragging    = ref(false)
const origin      = reactive({ x: 0, y: 0 })

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
  offset.x = Math.min(200, Math.max(-250, e.clientX - origin.x))
  offset.y = Math.min(200, Math.max(-250, e.clientY - origin.y))
}

function stopDrag() { dragging.value = false }

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