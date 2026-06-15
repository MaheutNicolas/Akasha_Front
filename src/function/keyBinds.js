const STORAGE_KEY = 'akasha:keybinds'

export const DEFAULT_KEYBINDS = {
  up:     'z',
  down:   's',
  left:   'q',
  right:  'd',
  r1:      '&',
  r2:      'é',
  r3:      '"',
  r4:      '\'',
  r5:      '(',
  r6:      '-',
  r7:      'è',
  r8:      '_',
  r9:      'ç',
}

/**
 * Charge les keybinds depuis le localStorage.
 * Les valeurs manquantes sont comblées par les défauts.
 * @returns {{ up: string, down: string, left: string, right: string, action: string }}
 */
export function loadKeybinds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    console.log(raw);
    
    if (!raw) return { ...DEFAULT_KEYBINDS }
    return { ...DEFAULT_KEYBINDS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_KEYBINDS }
  }
}

/**
 * Persiste les keybinds dans le localStorage.
 */
export function saveKeybinds(binds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(binds))
}