export interface CharacterMod {
  luck?: string,
  maxHp?: string,
  armor?: string,
  regen?: string,
  moveSpeed?: string,
  power?: string,
  magnet?: string
}
/*
let maxHp = ref(config.maxHp);
let armor = ref(config.armor);
let regen = ref(config.regen);
let moveSpeed = ref(config.moveSpeed);
let power = ref(config.power);
let magnet = ref(config.magnet);
*/

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
    "Antonio": {}
  }
})
