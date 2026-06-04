<template>
  <div class="game-map" ref="containerRef">
    <svg
      class="game-map__svg"
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart.prevent="startTouch"
      @touchmove.prevent="onTouch"
      @touchend="stopDrag"
    >
      <!-- Définitions : filtre glow + marqueurs de flèche si besoin -->
      <defs>
        <filter id="glow-player" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-boss" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g :transform="`translate(${offset.x}, ${offset.y})`">

        <!-- ── Traits de connexion (dessinés avant les nœuds) ── -->
        <g class="game-map__connections">
          <template v-for="conn in connections" :key="conn.id">
            <!-- Trait extérieur (double ligne — côté éloigné) -->
            <line
              :x1="conn.x1o" :y1="conn.y1o"
              :x2="conn.x2o" :y2="conn.y2o"
              class="game-map__conn-outer"
            />
            <!-- Trait intérieur (double ligne — côté proche) -->
            <line
              :x1="conn.x1i" :y1="conn.y1i"
              :x2="conn.x2i" :y2="conn.y2i"
              class="game-map__conn-inner"
            />
            <!-- Remplissage entre les deux rails -->
            <line
              :x1="conn.x1c" :y1="conn.y1c"
              :x2="conn.x2c" :y2="conn.y2c"
              class="game-map__conn-fill"
            />
          </template>
        </g>

        <!-- ── Nœuds ── -->
        <g class="game-map__nodes">
          <g
            v-for="node in renderedNodes"
            :key="node.key"
            :transform="`translate(${node.cx}, ${node.cy})`"
            :class="['game-map__node', `game-map__node--${node.type}`]"
          >
            <!-- Fond du nœud -->
            <rect
              :x="-NODE_HALF"
              :y="-NODE_HALF"
              :width="NODE_SIZE"
              :height="NODE_SIZE"
              class="game-map__node-bg"
              :filter="node.type === 'player' ? 'url(#glow-player)' : node.type === 'boss' ? 'url(#glow-boss)' : null"
            />
            <!-- Bordure double : externe -->
            <rect
              :x="-NODE_HALF"
              :y="-NODE_HALF"
              :width="NODE_SIZE"
              :height="NODE_SIZE"
              class="game-map__node-border-outer"
            />
            <!-- Bordure double : interne -->
            <rect
              :x="-NODE_HALF + BORDER_GAP"
              :y="-NODE_HALF + BORDER_GAP"
              :width="NODE_SIZE - BORDER_GAP * 2"
              :height="NODE_SIZE - BORDER_GAP * 2"
              class="game-map__node-border-inner"
            />
            <!-- Icône / symbole central -->
            <text
              x="0" y="0"
              dominant-baseline="central"
              text-anchor="middle"
              class="game-map__node-label"
            >{{ node.label }}</text>
          </g>
        </g>

      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue'

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
const props = defineProps({
  map: { type: Object, required: true },
})

// ─────────────────────────────────────────────────────────────────────────────
// Constantes géométriques
// ─────────────────────────────────────────────────────────────────────────────
const NODE_SIZE   = 40   // taille du nœud en px
const NODE_HALF   = NODE_SIZE / 2
const BORDER_GAP  = 4    // espace entre le bord externe et le bord interne (double bordure)
const SPACING     = 100  // distance entre les centres de deux nœuds adjacents
const CONN_OFFSET = 5    // demi-espace entre les deux rails du trait double
const CONN_GAP    = 3    // retrait depuis le bord du nœud pour que le trait ne touche pas la bordure

const SVG_PADDING = 80
const svgWidth    = 600
const svgHeight   = 500

// ─────────────────────────────────────────────────────────────────────────────
// Conversion coord jeu → pixel
// ─────────────────────────────────────────────────────────────────────────────
const toPixel = (gx, gy, minX, minY) => ({
  cx: SVG_PADDING + (gx - minX) * SPACING,
  cy: SVG_PADDING + (gy - minY) * SPACING,
})

// ─────────────────────────────────────────────────────────────────────────────
// Nœuds à rendre
// ─────────────────────────────────────────────────────────────────────────────
const NODE_LABELS = {
  default: '',
  player:  '◉',
  enemy:   '◆',
  boss:    '✦',
  locked:  '✕',
  trapped: '🕱',
}

const bounds = computed(() => {
  const nodes  = props.map?.nodes ?? {}
  const keys   = Object.keys(nodes)
  if (!keys.length) return null
  const coords = keys.map(k => k.split(',').map(Number))
  return {
    minX: Math.min(...coords.map(([x]) => x)),
    minY: Math.min(...coords.map(([, y]) => y)),
  }
})

const renderedNodes = computed(() => {
  const nodes   = props.map?.nodes   ?? {}
  const player  = props.map?.state?.player
  const enemies = props.map?.state?.enemies ?? []
  const b = bounds.value
  if (!b) return []

  return Object.entries(nodes).map(([key, node]) => {
    const [gx, gy] = key.split(',').map(Number)
    const { cx, cy } = toPixel(gx, gy, b.minX, b.minY)

    const TILE_TYPES = [
      { type: 'player',  match: () => player?.x === gx && player?.y === gy },
      { type: 'boss',    match: () => enemies.some(e => e.x === gx && e.y === gy && e.type === 'boss') },
      { type: 'enemy',   match: () => enemies.some(e => e.x === gx && e.y === gy) },
      { type: 'locked',  match: () => node.is_locked  === true },
      { type: 'trapped', match: () => node.is_trapped === true },
    ]

    const type = TILE_TYPES.find(t => t.match())?.type ?? 'default'
    const label = NODE_LABELS[type]

    return { key, cx, cy, type, label }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Connexions (double ligne)
// ─────────────────────────────────────────────────────────────────────────────
// Pour chaque direction passable d'un nœud vers un voisin existant,
// on calcule deux lignes parallèles décalées de CONN_OFFSET de chaque côté
// de l'axe de connexion, plus un remplissage central sombre.

const connections = computed(() => {
  const nodes = props.map?.nodes ?? {}
  const b     = bounds.value
  if (!b) return []

  const DELTA = { right: [1, 0], left: [-1, 0], down: [0, 1], up: [0, -1] }
  const seen  = new Set()
  const result = []

  Object.entries(nodes).forEach(([key, node]) => {
    const [gx, gy] = key.split(',').map(Number)

    Object.entries(node.paths ?? {}).forEach(([id, dir]) => {

      const [dx, dy]    = DELTA[dir]
      const neighborKey = `${gx + dx},${gy + dy}`

      // Dédoublonnage : on ne trace qu'une fois par paire
      const pairId = [key, neighborKey].sort().join('|')
      if (seen.has(pairId)) return
      seen.add(pairId)

      const { cx: ax, cy: ay } = toPixel(gx,      gy,      b.minX, b.minY)
      const { cx: bx, cy: by } = toPixel(gx + dx, gy + dy, b.minX, b.minY)

      // Vecteur unitaire de la direction
      const len = Math.hypot(bx - ax, by - ay)
      const ux  = (bx - ax) / len
      const uy  = (by - ay) / len
      // Vecteur perpendiculaire
      const px  = -uy
      const py  =  ux

      // Points de départ/arrivée avec retrait depuis le bord du nœud
      const gap = NODE_HALF + CONN_GAP
      const sx  = ax + ux * gap
      const sy  = ay + uy * gap
      const ex  = bx - ux * gap
      const ey  = by - uy * gap

      result.push({
        id: pairId,
        // Rail extérieur (+CONN_OFFSET)
        x1o: sx + px * CONN_OFFSET, y1o: sy + py * CONN_OFFSET,
        x2o: ex + px * CONN_OFFSET, y2o: ey + py * CONN_OFFSET,
        // Rail intérieur (-CONN_OFFSET)
        x1i: sx - px * CONN_OFFSET, y1i: sy - py * CONN_OFFSET,
        x2i: ex - px * CONN_OFFSET, y2i: ey - py * CONN_OFFSET,
        // Centre (remplissage sombre)
        x1c: sx, y1c: sy,
        x2c: ex, y2c: ey,
      })
    })
  })

  return result
})

// ─────────────────────────────────────────────────────────────────────────────
// Drag / Pan
// ─────────────────────────────────────────────────────────────────────────────

const offset   = reactive({ x: 0, y: 0 })
const dragging = ref(false)
const origin   = reactive({ x: 0, y: 0 })

function centerOnPlayer() {
  const player = props.map?.state?.player
  const b      = bounds.value
  if (!player || !b) return
  if (!props.map?.nodes || Object.keys(props.map.nodes).length === 0) return  // ← ajout

  const { cx, cy } = toPixel(player.x, player.y, b.minX, b.minY)
  offset.x = svgWidth  / 2 - cx
  offset.y = svgHeight / 2 - cy
}

watch(
  () => [props.map?.state?.player, bounds.value],
  () => centerOnPlayer(),
  { immediate: true, deep: true }
)

// Pan libre
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

let lastTouch = null
function startTouch(e) {
  lastTouch    = e.touches[0]
  origin.x = lastTouch.clientX - offset.x
  origin.y = lastTouch.clientY - offset.y
}
function onTouch(e) {
  const t  = e.touches[0]
  offset.x = t.clientX - origin.x
  offset.y = t.clientY - origin.y
}
</script>
