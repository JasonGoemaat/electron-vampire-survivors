export interface CharacterMod {
  luck?: string,
  maxHp?: string,
  armor?: string,
  regen?: string,
  moveSpeed?: string,
  power?: string,
  magnet?: string,
  cooldown?: string,
  area?: string,
  speed?: string,
  duration?: string,
  amount?: string,
  growth?: string,
  greed?: string,
  curse?: string,
  revivals?: string,
  rerolls?: string,
  skips?: string,
  banish?: string
  [x: string]: string | undefined,
}

export type CharacterMods = {
  [key: string]: CharacterMod
}

export interface Config {
  lastSavedMd5: string,
  characterMods: CharacterMods
}

export const createDefaultConfig = (): Config => ({
  lastSavedMd5: '',
  characterMods: {
  }
})
