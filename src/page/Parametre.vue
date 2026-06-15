<template>
  <div class="parametres">
    <div class="parametres_container">
        <header class="parametres__header">
        <h1 class="parametres__title">Paramètres</h1>
        <p class="parametres__sub">Configuration locale — stockée dans le navigateur</p>
        </header>

        <section class="parametres__section">
        <h2 class="parametres__section-title">Touches du terminal</h2>
        <p class="parametres__section-desc">
            Associe une touche clavier à chaque direction de navigation dans le terminal.
        </p>

        <div class="keybind-grid">
            <div
            v-for="action in ACTIONS"
            :key="action.key"
            class="keybind-row"
            >
            <span class="keybind-row__label">
                <span class="keybind-row__arrow">{{ action.arrow }}</span>
                {{ action.label }}
            </span>

            <div
                class="keybind-row__input"
                :class="{
                'is-listening': listening === action.key,
                'is-conflict':  conflicts.has(action.key),
                }"
                tabindex="0"
                @click="startListening(action.key)"
                @keydown.prevent="onKey($event, action.key)"
                @blur="stopListening"
            >
                <span v-if="listening === action.key" class="keybind-row__hint">
                Appuie sur une touche…
                </span>
                <kbd v-else class="keybind-row__kbd">
                {{ binds[action.key] ?? '—' }}
                </kbd>
            </div>

            <button
                class="keybind-row__reset"
                :title="'Réinitialiser ' + action.label"
                @click="resetOne(action.key, action.default)"
            >↺</button>
            </div>
        </div>

        <p class="parametres__section-desc">
            Active les runes dans l'ordre de la liste en utilisant, pour chacune d'elles, le bouton correspondant à sa position.
        </p>

        <div class="keybind-grid">
            <div
            v-for="action in ACTIONS_RUNES"
            :key="action.key"
            class="keybind-row"
            >
            <span class="keybind-row__label">
                <span class="keybind-row__arrow">{{ action.arrow }}</span>
                {{ action.label }}
            </span>

            <div
                class="keybind-row__input"
                :class="{
                'is-listening': listening === action.key,
                'is-conflict':  conflicts.has(action.key),
                }"
                tabindex="0"
                @click="startListening(action.key)"
                @keydown.prevent="onKey($event, action.key)"
                @blur="stopListening"
            >
                <span v-if="listening === action.key" class="keybind-row__hint">
                Appuie sur une touche…
                </span>
                <kbd v-else class="keybind-row__kbd">
                {{ binds[action.key] ?? '—' }}
                </kbd>
            </div>

            <button
                class="keybind-row__reset"
                :title="'Réinitialiser ' + action.label"
                @click="resetOne(action.key, action.default)"
            >↺</button>
            </div>
        </div>

        <p v-if="conflicts.size" class="parametres__conflict">
            ⚠ Certaines touches sont assignées à plusieurs actions.
        </p>
        </section>

        <div class="parametres__actions">
        <button class="btn" @click="resetAll">Réinitialiser tout</button>
        <button class="btn btn--primary" @click="save">Enregistrer</button>
        </div>

        <Transition name="toast">
        <div v-if="toastVisible" class="parametres__toast">
            ✓ Paramètres enregistrés
        </div>
        </Transition>
     </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { loadKeybinds, saveKeybinds, DEFAULT_KEYBINDS } from '@/function/keyBinds.js'

const ACTIONS = [
  { key: 'up',    label: 'Haut',   arrow: '↑', default: DEFAULT_KEYBINDS.up    },
  { key: 'down',  label: 'Bas',    arrow: '↓', default: DEFAULT_KEYBINDS.down  },
  { key: 'left',  label: 'Gauche', arrow: '←', default: DEFAULT_KEYBINDS.left  },
  { key: 'right', label: 'Droite', arrow: '→', default: DEFAULT_KEYBINDS.right },
]

const ACTIONS_RUNES = [
  { key: 'r1',     label: 'Rune 1', arrow: '✦', default: DEFAULT_KEYBINDS.r1 },
  { key: 'r2',     label: 'Rune 2', arrow: '✦', default: DEFAULT_KEYBINDS.r2 },
  { key: 'r3',     label: 'Rune 3', arrow: '✦', default: DEFAULT_KEYBINDS.r3 },
  { key: 'r4',     label: 'Rune 4', arrow: '✦', default: DEFAULT_KEYBINDS.r4 },
  { key: 'r5',     label: 'Rune 5', arrow: '✦', default: DEFAULT_KEYBINDS.r5 },
  { key: 'r6',     label: 'Rune 6', arrow: '✦', default: DEFAULT_KEYBINDS.r6 },
  { key: 'r7',     label: 'Rune 7', arrow: '✦', default: DEFAULT_KEYBINDS.r7 },
  { key: 'r8',     label: 'Rune 8', arrow: '✦', default: DEFAULT_KEYBINDS.r8 },
  { key: 'r9',     label: 'Rune 9', arrow: '✦', default: DEFAULT_KEYBINDS.r9 },
]

const binds     = ref({ ...DEFAULT_KEYBINDS })
const listening = ref(null)
const toastVisible = ref(false)

onMounted(() => {
  binds.value = loadKeybinds()
})

// Détection des conflits (même touche sur deux actions)
const conflicts = computed(() => {
  const seen = {}
  const dupes = new Set()
  
  for (const [action, key] of Object.entries(binds.value)) {
    if (key && seen[key]) {      
      dupes.add(action)
      dupes.add(seen[key])
    } else if (key) {
      seen[key] = action
    }
  }
  return dupes
})

function startListening(actionKey) {
  listening.value = actionKey
}

function stopListening() {
  // Add small delai before
  setTimeout(() => { listening.value = null }, 100)
}

function onKey(e, actionKey) {
  if (!listening.value) return

  const label = formatKey(e)
  
  binds.value = { ...binds.value, [actionKey]: label }
  listening.value = null
}

function formatKey(e) {
  return e.key
}

function resetOne(actionKey, defaultValue) {
  binds.value = { ...binds.value, [actionKey]: defaultValue }
}

function resetAll() {
  binds.value = { ...DEFAULT_KEYBINDS }
}

let toastTimer = null
function save() {
  saveKeybinds(binds.value)
  toastVisible.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 2500)
}
</script>